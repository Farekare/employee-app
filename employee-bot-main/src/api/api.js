const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model");
const axios = require("axios");
const Counter = require("./counter");
const { Parser } = require('json2csv');
const FormData = require('form-data');

const app = express();
const PORT = 4000;

const corsOptions = {
  origin: "https://farekare.github.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Функция для генерации и отправки CSV со всеми контактами
async function generateAndSendCSV(chatId) {
  try {
    // Получаем общее количество контактов
    const totalContacts = await User.countDocuments();
    
    // Отправляем сообщение с информацией о начале генерации
    const BOT_TOKEN = process.env.BOT_TOKEN;
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `Starting CSV generation for ${totalContacts} contacts...`
    });

    // Получаем все контакты
    const contacts = await User.find()
      .lean()
      .select('name email tags notes region'); // выбираем нужные поля

    if (contacts.length === 0) {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "No contacts found in the database."
      });
      return;
    }

    // Преобразуем даты и массивы в строки для CSV
    const processedContacts = contacts.map(contact => ({
      ...contact,
      tags: contact.tags.join(', ')
    }));

    // Определяем поля для CSV
    const fields = [
      { 
        label: 'Name',
        value: 'name'
      },
      {
        label: 'Email',
        value: 'email'
      },
      {
        label: 'Tags',
        value: 'tags'
      },
      {
        label: 'Notes',
        value: 'notes'
      },
      {
        label: 'Region',
        value: 'region'
      }
    ];

    // Опции для генерации CSV
    const json2csvParser = new Parser({ 
      fields,
      delimiter: ',',
      quote: '"',
      escapeQuote: '"',
      header: true
    });

    // Генерируем CSV в памяти
    const csv = json2csvParser.parse(processedContacts);

    // Создаем form-data для отправки файла
    const form = new FormData();
    form.append('document', Buffer.from(csv, 'utf-8'), {
      filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`,
      contentType: 'text/csv',
    });
    form.append('chat_id', chatId);
    form.append('caption', `Complete contacts export (${contacts.length} records)`);

    // Отправляем файл в Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    // Отправляем сообщение об успешном завершении
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `✅ CSV file has been generated and sent successfully!\nTotal contacts: ${contacts.length}`
    });

    return response.data;
  } catch (error) {
    console.error('Error generating and sending CSV:', error);
    
    // Отправляем сообщение об ошибке в Telegram
    try {
      await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `❌ Error generating CSV file: ${error.message}`
      });
    } catch (telegramError) {
      console.error('Error sending error message to Telegram:', telegramError);
    }
    
    throw error;
  }
}

// Функция уведомления в Telegram
async function notifyTelegramBot(chatId) {
  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const notificationUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    // Отправляем начальное уведомление
    await axios.post(notificationUrl, {
      text: "New contacts have been added. Generating full CSV report...",
      chat_id: chatId,
    });

    // Генерируем и отправляем CSV
    await generateAndSendCSV(chatId);
  } catch (error) {
    console.error('Error in Telegram notification process:', error);
  }
}

app.post("/api/insert-contact", async (req, res) => {
  console.log("POST /api/insert-contact received:", req.body);
  const { name, email, tags, notes, region } = req.body;
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
    const ADMIN_ID= process.env.ADMIN_ID;
    console.log(ADMIN_ID)
    // Проверяем, достигли ли мы 5 вставок
    if (counter.count % 5 === 0) {
      // Отправляем уведомление и CSV
      await notifyTelegramBot(ADMIN_ID);
    }

    res.status(201).send(contact);
    console.log("New contact inserted:", newContact);
  } catch (e) {
    console.error("Error saving contact:", e);
    res.status(500).send({ error: "Error inserting contact" });
  }
});

// Остальные маршруты остаются без изменений
app.post("/api/fetch-contacts", async (req, res) => {
  const { tags, region } = req.body;
  console.log("POST /api/fetch-contacts received:", tags, region);
  try {
    let query = {};
    if (tags != undefined && tags.length > 0) {
      query.tags = { $all: tags };
      console.log(query.tags)
    }
    if (region != undefined && region != "All" && region != "") {
      query.region = region;
    }
    console.log(query)
    const users = await User.find(query);
    console.log(users)
    res.status(200).send(users);
  } catch (e) {
    console.error("Error fetching contacts:", e);
    res.status(500).send({ error: "Error fetching contacts" });
  }
});

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

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("Mongo connection error:", e));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});