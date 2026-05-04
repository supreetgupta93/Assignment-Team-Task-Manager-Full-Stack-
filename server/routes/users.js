const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all users (ADMIN ONLY)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Only admins can view all users' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;