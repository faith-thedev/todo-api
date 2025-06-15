const express = require('express');
const router = express.Router();

const authRoutes = require('./users');
const todoRoutes = require('./todo');

// Mount routes
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 Handling
router.use((req, res) => {
  if (req.accepts('html')) {
    return res.status(404).render('404', { title: 'Page Not Found' });
  }
  if (req.accepts('json')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).send('Not found');
});

module.exports = router;