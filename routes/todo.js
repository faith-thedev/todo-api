const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const todoController = require('../controllers/todo');

// API Routes
router.get('/api', ensureAuthenticated, todoController.getTodos);
router.post('/api', ensureAuthenticated, todoController.createTodo);
router.put('/api/:id', ensureAuthenticated, todoController.updateTodo);
router.delete('/api/:id', ensureAuthenticated, todoController.deleteTodo);

// View Routes
router.get('/', ensureAuthenticated, todoController.showTodosPage);

module.exports = router;