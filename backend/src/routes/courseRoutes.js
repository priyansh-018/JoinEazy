const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Public lookup by code (or authenticated)
router.get('/code/:code', courseController.getCourseByCode);

// Protected routes
router.use(verifyToken);
router.post('/', requireRole('admin'), courseController.createCourse);
router.get('/my', courseController.getMyCourses);
router.get('/all', courseController.getAllCourses);
router.get('/:id/groups', courseController.getCourseGroups);
router.delete('/:id', requireRole('admin'), courseController.deleteCourse);

module.exports = router;
