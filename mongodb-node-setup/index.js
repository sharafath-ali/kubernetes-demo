const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb://127.0.0.1:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose schema and model
const visitSchema = new mongoose.Schema({
  name: { type: String, default: 'site_visits' },
  count: { type: Number, default: 0 }
});
const Visit = mongoose.model('Visit', visitSchema);

// Endpoint to handle the simple update operation
app.get('/', async (req, res) => {
  try {
    // Find the document and increment the count, or create it if it doesn't exist
    const doc = await Visit.findOneAndUpdate(
      { name: 'site_visits' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.send(`<h1>MongoDB Update Successful!</h1><p>You have hit this page <strong>${doc.count}</strong> times.</p>`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating the database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
