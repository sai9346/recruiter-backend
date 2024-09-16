const Recruiter = require('../models/Recruiter');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpGenerator = require('../utils/otpGenerator');
const { sendVerificationEmail, sendOtp } = require('../services/emailService');
const errorHandler = require('../utils/errorHandler');

exports.register = async (req, res) => {
    const { fullName, companyName, email, jobTitle, contactNumber, companyWebsite, password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const recruiter = new Recruiter({ fullName, companyName, email, jobTitle, contactNumber, companyWebsite, password });
    
    // Generate OTP and send
    const otp = otpGenerator.generate();
    recruiter.otp = otp;
    recruiter.otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    await recruiter.save();

    sendOtp(recruiter.email, otp);
    res.status(201).json({ message: 'Registration successful. Please check your email for OTP.' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!recruiter.isVerified || !recruiter.isAdminApproved) {
        return res.status(403).json({ error: 'You must complete verification and wait for admin approval.' });
    }

    const token = jwt.sign({ recruiterId: recruiter._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });
};

exports.verifyEmail = async (req, res) => {
    const token = req.params.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const recruiter = await Recruiter.findById(decoded.recruiterId);
        if (!recruiter) return res.status(400).json({ error: 'Invalid token' });

        recruiter.isVerified = true;
        await recruiter.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        errorHandler(res, err);
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) return res.status(400).json({ error: 'Recruiter not found' });

    if (recruiter.otp !== otp || Date.now() > recruiter.otpExpires) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    recruiter.isVerified = true;
    recruiter.otp = null;
    recruiter.otpExpires = null;
    await recruiter.save();

    res.status(200).json({ message: 'OTP verified successfully' });
};

exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) return res.status(400).json({ error: 'Recruiter not found' });

    const otp = otpGenerator.generate();
    recruiter.otp = otp;
    recruiter.otpExpires = Date.now() + 10 * 60 * 1000;

    await recruiter.save();

    sendOtp(recruiter.email, otp);
    res.status(200).json({ message: 'OTP resent successfully' });
};
