const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model');
const app = express();
const PORT = 4000;

// CORS configuration
const corsOptions = {
  origin: 'https://farekare.github.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Route for adding an employee
app.post('/api/employees', async (req, res) => {
  console.log('POST /api/employees received:', req.body);
  const { name, email, tags, notes } = req.body;

  const newEmployee = { name, email, tags, notes };

  try {
    const employee = new User(newEmployee);
    await employee.save();
    res.status(201).send(employee);
    console.log('New Employee added:', newEmployee);
  } catch (e) {
    console.error('Error saving employee:', e);
    res.status(500).send({ error: 'Error adding employee' });
  }
});

// Route for searching employees by tags
app.post('/api/search-employees', async (req, res) => {
  const { tags } = req.body;
  console.log('POST /api/search-employees received:', tags);
  try {
    const users = await User.find({ tags: { $in: tags } });
    res.status(200).send(users);
  } catch (e) {
    console.error('Error searching employees:', e);
    res.status(500).send({ error: 'Error searching employees' });
  }
});

// Route for updating an employee
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const updatedEmployee = req.body;

  try {
    await User.updateOne({ _id: id }, updatedEmployee);
    res.json({ message: 'Employee updated' });
  } catch (e) {
    console.error('Error updating employee:', e);
    res.status(500).send({ error: 'Error updating employee' });
  }
});

// Route for deleting an employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/employees/:id received:', id);

  try {
    await User.deleteOne({ _id: id });
    res.json({ message: 'Employee deleted' });
  } catch (e) {
    console.error('Error deleting employee:', e);
    res.status(500).send({ error: 'Error deleting employee' });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:VSNydI7Fm3GthN3d@jarvel.9dzcywn.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.error('Mongo connection error:', e));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
