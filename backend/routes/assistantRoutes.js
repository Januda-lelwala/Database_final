const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const assistantController = require('../controllers/assistantController');

// Admin assistant routes - all require admin authentication
// Self profile endpoints must come before :id routes
router.get('/me', verifyUser, assistantController.getMyProfile);
router.put('/me', verifyUser, assistantController.updateMyProfile);

// Admin manage endpoints
router.get('/', verifyAdmin, assistantController.getAllAssistants);
router.get('/:id', verifyAdmin, assistantController.getAssistantById);
router.post('/', verifyAdmin, assistantController.createAssistant);
router.put('/:id', verifyAdmin, assistantController.updateAssistant);
router.delete('/:id', verifyAdmin, assistantController.deleteAssistant);
router.post('/:id/change-password', assistantController.changeAssistantPassword);

module.exports = router;
