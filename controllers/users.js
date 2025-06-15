const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      username: user.username
    }
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your_fallback_secret_key',
    { expiresIn: '1h' }
  );
};

// API: Register a new user
exports.apiRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user exists by email or username
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate token and send response
    const token = generateToken(user);
    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// API: Login user
exports.apiLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token and send response
    const token = generateToken(user);
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// WEB: Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/signup');
    }

    // Check if user exists by email or username
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      req.flash('error', 'Email or username already in use');
      return res.redirect('/auth/signup');
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    req.flash('success', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err.message);
    req.flash('error', 'Server error');
    res.redirect('/auth/signup');
  }
};

// WEB: Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    // Create session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    
    req.flash('success', 'You are now logged in');
    res.redirect('/todos');
  } catch (err) {
    console.error(err.message);
    req.flash('error', 'Server error');
    res.redirect('/auth/login');
  }
};

// WEB: Logout user
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err.message);
      req.flash('error', 'Error logging out');
      return res.redirect('/todos');
    }
    res.redirect('/auth/login');
  });
};

// Get current user (for API)
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};