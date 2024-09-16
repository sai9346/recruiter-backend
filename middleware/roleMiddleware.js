exports.roleMiddleware = role => (req, res, next) => {
    if (!req.recruiter || req.recruiter.role !== role) {
        return res.status(403).json({ error: 'Access denied, insufficient permissions' });
    }
    next();
};
