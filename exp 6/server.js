const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_db';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let isMongoConnected = false;
let Note;

// In-Memory fallback store if MongoDB is not running locally
let memoryNotes = [
  { _id: '1', title: 'Welcome Note', content: 'This is your first note in Notes Flow!', category: 'General', createdAt: new Date() }
];

try {
  Note = require('./models/Note');
  mongoose.connect(MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      console.log('Connected to MongoDB successfully');
    })
    .catch(err => {
      console.log('MongoDB Notice: Operating in local fallback mode (Mongo service not active).');
    });
} catch (err) {
  console.log('Mongoose loading notice:', err.message);
}

// Routes
// 1. Get all notes
app.get('/api/notes', async (req, res) => {
  if (isMongoConnected) {
    try {
      const notes = await Note.find().sort({ createdAt: -1 });
      return res.json(notes);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }
  res.json(memoryNotes);
});

// 2. Create a new note
app.post('/api/notes', async (req, res) => {
  const { title, content, category } = req.body;
  if (isMongoConnected) {
    try {
      const newNote = new Note({ title, content, category });
      const savedNote = await newNote.save();
      return res.status(201).json(savedNote);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to save note' });
    }
  }
  const fallbackNote = {
    _id: Date.now().toString(),
    title,
    content,
    category: category || 'General',
    createdAt: new Date()
  };
  memoryNotes.unshift(fallbackNote);
  res.status(201).json(fallbackNote);
});

// 3. Delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      await Note.findByIdAndDelete(id);
      return res.json({ message: 'Note deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete note' });
    }
  }
  memoryNotes = memoryNotes.filter(n => n._id !== id);
  res.json({ message: 'Note deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Notes App Server running at http://localhost:${PORT}`);
});
