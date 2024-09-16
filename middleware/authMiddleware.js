const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');
const dotenv = require('dotenv');

dotenv.config();

exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.recruiter = await Recruiter.findById(decoded.recruiterId).select('-password');
        if (!req.recruiter) return res.status(401).json({ error: 'Invalid token' });
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};