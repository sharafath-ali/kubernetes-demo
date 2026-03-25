const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    seedData();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);

async function seedData() {
  const count = await Item.countDocuments();
  if (count === 0) {
    await Item.insertMany([
      { name: "Docker", description: "Containerization platform" },
      { name: "MongoDB", description: "NoSQL database" },
      { name: "Express", description: "Node.js web framework" },
      { name: "React", description: "Frontend UI library" },
      { name: "Node.js", description: "JavaScript runtime" },
    ]);
    console.log("🌱 Seeded initial data");
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
