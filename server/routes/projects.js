const express = require('express');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const { validateProjectCreate } = require('../middleware/validation');

const router = express.Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ createdBy: req.user.id }, { members: req.user.id }] }).populate('createdBy', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching projects' });
  }
});

// Create project (ADMIN ONLY)
router.post('/', auth, validateProjectCreate, async (req, res) => {
  const { name, description } = req.body;
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Only admins can create projects' });
    }

    const project = new Project({ 
      name: name.trim(), 
      description: description.trim(), 
      createdBy: req.user.id, 
      members: [req.user.id] 
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating project' });
  }
});

// Update project
router.put('/:id', auth, validateProjectCreate, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only project creator can update it' });
    }

    project.name = name.trim();
    project.description = description.trim();
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error updating project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only project creator can delete it' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting project' });
  }
});

module.exports = router;