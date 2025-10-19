const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const assistantController = require('../controllers/assistantController');

// Admin assistant routes - all require admin authentication
router.get('/', verifyAdmin, assistantController.getAllAssistants);
router.get('/:id', verifyAdmin, assistantController.getAssistantById);
router.post('/', verifyAdmin, assistantController.createAssistant);
router.put('/:id', verifyAdmin, assistantController.updateAssistant);
router.delete('/:id', verifyAdmin, assistantController.deleteAssistant);
router.post('/:id/change-password', assistantController.changeAssistantPassword);

module.exports = router;
