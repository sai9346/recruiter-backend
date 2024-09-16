const Recruiter = require('../models/Recruiter');

exports.approveRecruiter = async (req, res) => {
    const recruiterId = req.params.id;

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });

    recruiter.isAdminApproved = true;
    await recruiter.save();

    res.status(200).json({ message: 'Recruiter approved successfully' });
};

exports.rejectRecruiter = async (req, res) => {
    const recruiterId = req.params.id;

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });

    await recruiter.remove();

    res.status(200).json({ message: 'Recruiter rejected and removed successfully' });
};
