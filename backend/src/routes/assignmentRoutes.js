const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.post('/', requireRole('admin'), assignmentController.createAssignment);
router.put('/:id', requireRole('admin'), assignmentController.updateAssignment);
router.delete('/:id', requireRole('admin'), assignmentController.deleteAssignment);

module.exports = router;
