const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', groupController.createGroup);
router.get('/my', groupController.getMyGroups);
router.get('/all', requireRole('admin'), groupController.getAllGroups);
router.post('/join', groupController.joinByCode);
router.get('/:id', groupController.getGroupDetails);
router.post('/:id/members', groupController.addMember);
router.delete('/:id/members/:userId', groupController.removeMember);

module.exports = router;
