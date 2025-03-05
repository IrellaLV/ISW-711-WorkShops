const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");

/**
 * Crear un nuevo curso
 */
const createCourse = (req, res) => {
  const { name, code, description, teacherId } = req.body;

  const course = new Course({
    name,
    code,
    description,
    teacher: teacherId
  });

  course.save()
    .then((course) => res.status(201).json(course))
    .catch((err) => res.status(422).json({ error: 'Error saving course', details: err }));
};

/**
 * Obtener todos los cursos
 */
const getCourses = (req, res) => {
  Course.find()
    .populate("teacher", "first_name last_name") // Obtener el nombre del profesor
    .then((courses) => res.json(courses))
    .catch((err) => res.status(500).json({ error: "Error fetching courses", details: err }));
};

/**
 * Obtener un curso por ID
 */
const getCourseById = (req, res) => {
  const { id } = req.params;

  Course.findById(id)
    .populate("teacher", "first_name last_name")
    .then((course) => {
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ error: "Course not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: "Error fetching course", details: err }));
};

/**
 * Actualizar un curso
 */
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, code, description, teacherId } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, { name, code, description, teacher: teacherId }, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

/**
 * Eliminar un curso
 */
const deleteCourse = (req, res) => {
  const { id } = req.params;

  Course.findByIdAndDelete(id)
    .then((deletedCourse) => {
      if (deletedCourse) {
        res.json({ message: "Course deleted successfully" });
      } else {
        res.status(404).json({ error: "Course not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: "Error deleting course", details: err }));
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};
