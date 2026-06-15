const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Schema
const SearchLogSchema = new mongoose.Schema({
  query: String,
  results: Array,
  timestamp: { type: Date, default: Date.now }
});

const ProviderSchema = new mongoose.Schema({
  providerId: Number,
  fullName: String,
  specialization: String,
  location: String,
  available: Boolean
});

const SearchLog = mongoose.model('SearchLog', SearchLogSchema);
const Provider = mongoose.model('Provider', ProviderSchema);

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ MediBook Search Service Running!', port: 7000 });
});

// Seed providers data
app.post('/seed', async (req, res) => {
  await Provider.deleteMany({});
  await Provider.insertMany([
    { providerId: 1, fullName: 'Dr. Rahul Sharma', specialization: 'General Consultation', location: 'Block A', available: true },
    { providerId: 2, fullName: 'Dr. Priya Singh', specialization: 'Skin Specialist', location: 'Block B', available: true }
  ]);
  res.json({ message: 'Providers seeded!' });
});

// Search providers
app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ results: [] });

  const results = await Provider.find({
    $or: [
      { fullName: { $regex: q, $options: 'i' } },
      { specialization: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } }
    ]
  });

  // Log the search
  await SearchLog.create({ query: q, results });

  res.json({ query: q, count: results.length, results });
});

// Get all providers
app.get('/providers', async (req, res) => {
  const providers = await Provider.find();
  res.json(providers);
});

// Get search history
app.get('/search-history', async (req, res) => {
  const logs = await SearchLog.find().sort({ timestamp: -1 }).limit(10);
  res.json(logs);
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Search Service running on port ${PORT}`);
});