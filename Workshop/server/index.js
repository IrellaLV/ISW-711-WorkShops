require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
const { teacherCreate, teacherGet, teacherUpdate, teacherDelete } = require('./controllers/teacherController');
app.use(cors({
  domains: '*',
  methods: "*"
}));

app.post('/teachers', teacherCreate); // POST endpoint to create teacher
app.get('/teachers', teacherGet); // GET endpoint to get all teachers
app.put('/teachers/:id', teacherUpdate); // PUT endpoint to update a teacher by ID
app.delete('/teachers/:id', teacherDelete); // DELETE endpoint to delete a teacher by ID



app.listen(3001, () => console.log(`Example app listening on port 3001!`))
