const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const router = express.Router();

// Rutas para cursos
router.post("/", createCourse);       // Crear un nuevo curso
router.get("/", getCourses);          // Obtener todos los cursos
router.get("/:id", getCourseById);    // Obtener un curso por ID
router.put("/:id", updateCourse);     // Actualizar un curso
router.delete("/:id", deleteCourse);  // Eliminar un curso

module.exports = router;