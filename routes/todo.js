const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../middleware/auth");
const todoController = require("../controllers/todo");
const Todo = require("../models/todo");

// API Routes
router.get("/api", ensureAuthenticated, todoController.getTodos);
router.post("/api", ensureAuthenticated, todoController.createTodo);
router.put("/api/:id", ensureAuthenticated, todoController.updateTodo);
router.delete("/api/:id", ensureAuthenticated, todoController.deleteTodo);

// View Routes
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({user: req.session.user.id}).sort({
      createdAt: -1,
    });
    res.render("todos/index", {
      title: "Todo",
      messages: req.flash(),
      currentUser: req.session.user,
      todos, //
    });
  } catch (err) {
    console.error(err.message);
    req.flash("error", "Failed to load todos");
    res.redirect("/auth/login");
  }
});
module.exports = router;
