const express = require('express');
const router = express.Router();
const authController = require('../controllers/users');

// API Routes
router.post('/api/login', authController.apiLogin);
router.post('/api/register', authController.apiRegister);

// View Routes
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login', messages: req.flash() });
});
router.post('/login', authController.login);
router.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'Sign Up', messages: req.flash() });
});
router.post('/signup', authController.register);
router.get('/logout', authController.logout);

module.exports = router;