require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Mover esta línea antes del uso de los controladores
const Teacher = require('./models/teacherModel');

const { teacherCreate, teacherGet, updateTeacher, teacherDelete } = require('./controllers/teacherController');
const Course = require('./models/courseModel'); 
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on('error', err => console.log('DB Connection Error:', err));
mongoose.connection.once('connected', () => console.log('Database Connected'));

// Rutas para profesores
app.post('/teachers', teacherCreate);
app.get('/teachers/:id?', teacherGet);
app.put('/teachers/:id', updateTeacher);
app.delete('/teachers/:id', teacherDelete);

// Rutas para cursos
app.get('/courses', (req, res) => {
    Course.find()
        .populate('teacher', 'first_name last_name')  // Esto llena la referencia 'teacher' con 'first_name' y 'last_name'
        .then(courses => res.json(courses))
        .catch(err => res.status(500).json({ message: 'Error fetching courses', error: err }));
});

app.post('/courses', (req, res) => {
    const { name, code, description, teacherId } = req.body;

    if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: 'Invalid Teacher ID' });
    }

    Teacher.findById(teacherId)
        .then(teacher => {
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

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

// Ruta para editar un curso
app.put('/courses/:id', (req, res) => {
    const { name, code, description, teacherId } = req.body;
    const { id } = req.params;

    console.log("Updating Course:", { name, code, description, teacherId, id });

    // Validating teacherId
    if (teacherId && !mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: 'Invalid Teacher ID' });
    }

    // Find course by ID
    Course.findById(id)
        .then(course => {
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Update course fields
            if (teacherId) {
                course.teacher = teacherId;
            }
            course.name = name || course.name;
            course.code = code || course.code;
            course.description = description || course.description;

            // Save updated course
            course.save()
                .then(updatedCourse => res.json(updatedCourse))
                .catch(err => {
                    console.error('Error updating course:', err);
                    res.status(500).json({ message: 'Error updating course', error: err });
                });
        })
        .catch(err => {
            console.error('Error finding course:', err);
            res.status(500).json({ message: 'Error finding course', error: err });
        });
});

// Ruta para eliminar un curso
app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;

    // Eliminar el curso por ID
    Course.findByIdAndDelete(id)
        .then(deletedCourse => {
            if (!deletedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json({ message: 'Course deleted successfully' });
        })
        .catch(err => {
            console.error('Error deleting course:', err);
            res.status(500).json({ message: 'Error deleting course', error: err });
        });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
