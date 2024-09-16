const express = require('express');
const router = express.Router();
const { approveRecruiter, rejectRecruiter } = require('../controllers/adminController');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// PUT /admin/approve-recruiter/:id
router.put('/approve-recruiter/:id', roleMiddleware('Admin'), approveRecruiter);

// PUT /admin/reject-recruiter/:id
router.put('/reject-recruiter/:id', roleMiddleware('Admin'), rejectRecruiter);

module.exports = router;
