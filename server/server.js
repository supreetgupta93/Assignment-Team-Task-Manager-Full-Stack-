const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config(); // ✅ Correct for Railway

const app = express();

// ===============================
// TRUST PROXY (for Render/Railway)
// ===============================
app.set('trust proxy', 1);

// ===============================
// SECURITY MIDDLEWARE
// ===============================
app.use(helmet());

app.use(cors({
  origin: "*", // You can restrict later to frontend URL
}));

app.use(express.json());

// ===============================
// RATE LIMITING (AUTH ROUTES)
// ===============================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// ===============================
// ROOT ROUTE (IMPORTANT)
// ===============================
app.get("/", (req, res) => {
  res.send("Team Task Manager API is running 🚀");
});

// ===============================
// DATABASE CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ===============================
// ROUTES
// ===============================
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===============================
// ERROR HANDLING
// ===============================
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }
  throw err;
});
