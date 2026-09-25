const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Health Check & Root Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'FoodWise AI API',
    tagline: 'Predict less. Waste less. Feed more.',
    timestamp: new Date().toISOString()
  });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const consumptionRoutes = require('./routes/consumptionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const surplusRoutes = require('./routes/surplusRoutes');

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/surplus', surplusRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server and verify DB
app.listen(PORT, async () => {
  console.log(`🚀 FoodWise AI Backend running on port ${PORT}`);
  await initDatabase();
});

module.exports = app;
