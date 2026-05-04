const Joi = require('joi');

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
    role: Joi.string().valid('Admin', 'Member').default('Member')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};

const validateProjectCreate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(5).max(500).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};

const validateTaskCreate = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(5).max(500).required(),
    dueDate: Joi.date().required(),
    projectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    assignedTo: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};

const validateTaskUpdate = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('To Do', 'In Progress', 'Completed').required(),
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(5).max(500),
    dueDate: Joi.date(),
    assignedTo: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateProjectCreate,
  validateTaskCreate,
  validateTaskUpdate
};
