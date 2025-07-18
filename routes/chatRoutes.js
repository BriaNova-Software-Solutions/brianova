const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Ruta para guardar conversaciones
router.post('/save-chat', chatController.saveChat);

module.exports = router;