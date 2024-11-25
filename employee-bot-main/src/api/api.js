const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model");
const axios = require("axios");
const Counter = require("./counter")
const app = express();
const PORT = 4000;

const corsOptions = {
  origin: "https://farekare.github.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(bodyParser.json());


async function notifyTelegramBot(chatId) {
  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const notificationUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    await axios.post(notificationUrl, {
      text: "10 new contacts have been added. Generating CSV report...",
      chat_id: chatId,
    });
  } catch (error) {
    console.error('Error notifying Telegram bot:', error);
  }
}

app.post("/api/insert-contact", async (req, res) => {
  console.log("POST /api/insert-contact received:", req.body);
  const { name, email, tags, notes, region, chatId } = req.body;

  const newContact = { name, email, tags, notes, region };

  try {
    // Сохраняем новый контакт
    const contact = new User(newContact);
    await contact.save();

    // Обновляем счетчик
    const counter = await Counter.findByIdAndUpdate(
      'insertCounter',
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    // Проверяем, достигли ли мы 10 вставок
    if (counter.count % 1 === 0) {
      // Отправляем уведомление боту
      await notifyTelegramBot(chatId);
    }

    res.status(201).send(contact);
    console.log("New contact inserted:", newContact);
  } catch (e) {
    console.error("Error saving contact:", e);
    res.status(500).send({ error: "Error inserting contact" });
  }
});

app.post("/api/fetch-contacts", async (req, res) => {
  const { tags, region } = req.body;
  console.log("POST /api/fetch-contacts received:", tags, region);
  try {
    let query = {};
    if (tags != undefined && tags.length > 0) {
      query.tags = { $all: tags };
    }
    if (region != undefined && region != "All" && region != "") {
      query.region = region;
    }

    const users = await User.find(query);

    res.status(200).send(users);
  } catch (e) {
    console.error("Error fetching contacts:", e);
    res.status(500).send({ error: "Error fetching contacts" });
  }
});

// Route for updating a contact
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
