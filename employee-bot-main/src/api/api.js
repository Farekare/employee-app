const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const User = require('./model')
// Для обработки JSON в запросах

const corsOptions = {
  origin: 'https://farekare.github.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));


// Маршрут для добавления сотрудника
app.post('/api/employees', async (req, res) => {
  const { name, email, tags, notes } = req.body;


  // Создание нового сотрудника
  const newEmployee = {
    name,
    email,
    tags,
    notes,
  };
  try {
    const employee = new User(newEmployee);
    await employee.save();
    res.status(201).send(employee);
  }
  catch (e)
  {
    console.log(e);
  }

  console.log('New Employee added:', newEmployee);

});

// Запрос для получения сотрудников по тегам
app.post('/api/search-employees', async (req, res) => {
  const {tags} = req.body;
  console.log(tags)
  const users = await User.find({tags: { $in: tags}});
  res.status(201).send(users)
  
});

app.put('/api/employees/:id', async (req, res) => 
    {
        const {id} = req.params;
        const updatedEmployee = req.body;
        await User.updateOne({_id: id}, updatedEmployee);
        res.json({message: 'Employee updated'});
    }
)
app.delete('/api/employees/:id', async (req, res) => 
{
    const {id} = req.params;
    console.log(id)
    await User.deleteOne({_id: id});
    res.json({message: 'Employee deleted'})
}
)
    

mongoose.connect("mongodb+srv://admin:VSNydI7Fm3GthN3d@jarvel.9dzcywn.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log('Connected to mongo')).catch(()=>console.log('Mongo connection error'))
    // Запуск сервера
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

