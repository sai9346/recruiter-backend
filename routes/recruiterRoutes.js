const express = require('express');
const router = express.Router();
const { getRecruiterProfile, updateRecruiterProfile } = require('../controllers/recruiterController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /recruiter/:id (Get recruiter profile)
router.get('/:id', authMiddleware, getRecruiterProfile);

// PUT /recruiter/:id (Update recruiter profile)
router.put('/:id', authMiddleware, updateRecruiterProfile);

module.exports = router;
