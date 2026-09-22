const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const academyRoutes = require('./routes/academies');
const opportunityRoutes = require('./routes/opportunities');
const applyRoutes = require('./routes/apply');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/academies', academyRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/apply', applyRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ Mongoose disconnected');
});
app.get('/', (req, res) => {
  res.send('Sportzzbook API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
