const express = require('express');
const { authController } = require('../controllers/AuthController');
const router = express.Router();
router.post("/login", authController.Login)
module.exports = router;