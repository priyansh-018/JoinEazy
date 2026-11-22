const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/admin', requireRole('admin'), analyticsController.getAdminAnalytics);
router.get('/student-progress', analyticsController.getStudentProgress);

module.exports = router;
