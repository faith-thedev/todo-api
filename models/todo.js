const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensures the field is mandatory
    trim: true, // Removes whitespace
  },
  description: {
    type: String,
    default: "", // Optional field
  },
  completed: {
    type: Boolean,
    default: false, // Defaults to "not completed"
  },
  dueDate: {
    type: Date, // Optional deadline
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"], // Only allows these values
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Auto-sets on creation
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links to a User model (for multi-user apps)
    required: true,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
