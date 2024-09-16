const Recruiter = require('../models/Recruiter');
const errorHandler = require('../utils/errorHandler');

// Get recruiter profile by ID
exports.getRecruiterProfile = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id).select('-password');
        if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });
        res.status(200).json(recruiter);
    } catch (err) {
        errorHandler(res, err);
    }
};

// Update recruiter profile
exports.updateRecruiterProfile = async (req, res) => {
    try {
        const { fullName, companyName, jobTitle, contactNumber, companyWebsite } = req.body;
        const recruiter = await Recruiter.findById(req.params.id);

        if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });

        recruiter.fullName = fullName || recruiter.fullName;
        recruiter.companyName = companyName || recruiter.companyName;
        recruiter.jobTitle = jobTitle || recruiter.jobTitle;
        recruiter.contactNumber = contactNumber || recruiter.contactNumber;
        recruiter.companyWebsite = companyWebsite || recruiter.companyWebsite;

        await recruiter.save();

        res.status(200).json({ message: 'Profile updated successfully', recruiter });
    } catch (err) {
        errorHandler(res, err);
    }
};
