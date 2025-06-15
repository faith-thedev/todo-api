// controllers/todos.js
const Todo = require('../models/todo');

exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTodo = new Todo({
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      user: req.user.id
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);

  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserTodos = async (userId) => {
  return await Todo.find({ user: userId }).sort({ createdAt: -1 });
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate, priority } = req.body;

    const todo = await Todo.findOne({ _id: id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (dueDate) todo.dueDate = dueDate;
    if (priority) todo.priority = priority;

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);

  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};