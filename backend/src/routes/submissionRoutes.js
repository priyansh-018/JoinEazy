const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Two-step verification submission
router.post('/two-step-confirm', submissionController.submitTwoStep);
router.post('/peer-confirm', submissionController.studentConfirm);

// Admin or authorized members view group-wise & student-wise submission confirmations
router.get('/assignment/:assignment_id', submissionController.getAssignmentSubmissions);

// Admin verify status
router.put('/:submission_id/verify', requireRole('admin'), submissionController.verifySubmission);

module.exports = router;
