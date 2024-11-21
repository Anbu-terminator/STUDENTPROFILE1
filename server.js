require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Models
const Student = require('./models/Student');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Failed to connect to MongoDB:', err));

// Serve page1.html directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page1.html'));
});

// Student Routes
app.get('/api/students', async (req, res) => {
    const search = req.query.search || '';
    try {
        const students = await Student.find({ name: new RegExp(search, 'i') });
        res.send(students);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
