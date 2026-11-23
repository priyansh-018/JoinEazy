const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const courseRoutes = require('./routes/courseRoutes');
const supportRoutes = require('./routes/supportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Render, Cloudflare, Nginx) for HTTPS headers
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for API calls
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Joineazy Student, Group & Assignment Management System API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/support', supportRoutes);

// Serve static frontend in production if built
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl === '/health') {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error Handling Middleware
app.use(errorHandler);

// Start server after DB initialization
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Joineazy API Server running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
