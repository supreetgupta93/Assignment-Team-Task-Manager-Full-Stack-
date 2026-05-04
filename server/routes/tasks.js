const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const { validateTaskCreate, validateTaskUpdate } = require('../middleware/validation');

const router = express.Router();

// Get tasks
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'Admin'
      ? {}
      : { assignedTo: req.user.id };
    const tasks = await Task.find(filter).populate('projectId assignedTo createdBy', 'name title email');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
});

// Create task (ADMIN ONLY)
router.post('/', auth, validateTaskCreate, async (req, res) => {
  const { title, description, dueDate, projectId, assignedTo } = req.body;
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Only admins can create tasks' });
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee || assignee.role !== 'Member') {
      return res.status(400).json({ msg: 'Task must be assigned to a valid member' });
    }

    const task = new Task({ 
      title: title.trim(), 
      description: description.trim(), 
      dueDate, 
      projectId, 
      assignedTo, 
      createdBy: req.user.id 
    });
    await task.save();
    await task.populate('projectId assignedTo createdBy', 'name title email');
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating task' });
  }
});

// Update task
router.put('/:id', auth, validateTaskUpdate, async (req, res) => {
  const { status, title, description, dueDate, assignedTo } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Only assigned member can update status
    if (req.body.status) {
      if (req.user.role !== 'Member' || task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Only the assigned member can update task status' });
      }
      task.status = status;
    }

    // Only admin can update other fields
    if (title || description || dueDate || assignedTo) {
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Only admins can edit task details' });
      }
      if (title) task.title = title.trim();
      if (description) task.description = description.trim();
      if (dueDate) task.dueDate = dueDate;
      if (assignedTo) {
        const assignee = await User.findById(assignedTo);
        if (!assignee || assignee.role !== 'Member') {
          return res.status(400).json({ msg: 'Task must be assigned to a valid member' });
        }
        task.assignedTo = assignedTo;
      }
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error updating task' });
  }
});

// Delete task (ADMIN ONLY)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Only admins can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting task' });
  }
});

module.exports = router;