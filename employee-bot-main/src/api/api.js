const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model");
const app = express();
const PORT = 4000;

// CORS configuration
const corsOptions = {
  origin: "https://farekare.github.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Route for adding an contact
app.post("/api/contacts", async (req, res) => {
  console.log("POST /api/contacts received:", req.body);
  const { name, email, tags, notes, region } = req.body;

  const newContact = { name, email, tags, notes, region };

  try {
    const contact = new User(newContact);
    await contact.save();
    res.status(201).send(contact);
    console.log("New contact added:", newContact);
  } catch (e) {
    console.error("Error saving contact:", e);
    res.status(500).send({ error: "Error adding contact" });
  }
});

// Route for searching contacts by tags
app.post("/api/search-contacts", async (req, res) => {
  const { tags, region } = req.body;
  console.log("POST /api/search-contacts-tags received:", tags, region);
  try {
    let queryObject = {};
    if (tags.length > 0) {
      queryObject.tags = { $all: tags };
    }
    if (region != "All" && region != "") {
      queryObject.region = region;
    }

    const users = await User.find(queryObject);

    res.status(200).send(users);
  } catch (e) {
    console.error("Error searching contacts:", e);
    res.status(500).send({ error: "Error searching contacts" });
  }
});

// Route for updating an contact
app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  console.log("PUT /api/contacts/:id received:", id);
  const updatedContact = req.body;

  try {
    await User.updateOne({ _id: id }, updatedContact);
    res.json({ message: "contact updated" });
    console.log("contact updated:", updatedContact);
  } catch (e) {
    console.error("Error updating contact:", e);
    res.status(500).send({ error: "Error updating contact" });
  }
});

// Route for deleting a contact
app.delete("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/contacts/:id received:", id);

  try {
    await User.deleteOne({ _id: id });
    res.json({ message: "contact deleted" });
  } catch (e) {
    console.error("Error deleting contact:", e);
    res.status(500).send({ error: "Error deleting contact" });
  }
});

// Connect to MongoDB
mongoose
  .connect("mongodb://mongo:27017/telegram_bot")
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("Mongo connection error:", e));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
