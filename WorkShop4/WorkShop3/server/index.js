require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const { teacherCreate, teacherGet, updateTeacher, teacherDelete } = require('./controllers/teacherController');
const Course = require('./models/courseModel'); 
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on('error', err => console.log('DB Connection Error:', err));
mongoose.connection.once('connected', () => console.log('Database Connected'));

const teacher  = require('./models/teacherModel');


app.post('/teachers', teacherCreate);
app.get('/teachers/:id?', teacherGet);
app.put('/teachers/:id', updateTeacher);
app.delete('/teachers/:id', teacherDelete);

// Example for courses route handling in backend
app.get('/api/courses', (req, res) => {
    // Assuming you have a Course model to interact with the database
    Course.find()
        .then(courses => res.json(courses))
        .catch(err => res.status(500).json({ message: 'Error fetching courses', error: err }));
});

app.post('/courses', (req, res) => {
    const { name, code, description, teacherId } = req.body;

    // Verifica si el teacherId está presente
    if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required' });
    }

    // Verifica si el teacherId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: 'Invalid Teacher ID' });
    }

    // Verifica si el profesor existe en la base de datos
    Teacher.findById(teacherId)
        .then(teacher => {
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            // Crear el nuevo curso
            const newCourse = new Course({
                name,
                code,
                description,
                teacher: teacherId
            });

            newCourse.save()
                .then(course => res.status(201).json(course))
                .catch(err => {
                    console.error('Error saving course:', err);
                    res.status(500).json({ message: 'Error creating course', error: err });
                });
        })
        .catch(err => {
            console.error('Error finding teacher:', err);
            res.status(500).json({ message: 'Error finding teacher', error: err });
        });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));