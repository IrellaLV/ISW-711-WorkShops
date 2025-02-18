const Teacher = require("../models/teacherModel");

/**
 * Creates a teacher
 */
const teacherCreate = (req, res) => {
  let teacher = new Teacher({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    cedula: req.body.cedula
  });

  teacher.save()
    .then(() => res.status(201).json(teacher))
    .catch((err) => res.status(422).json({ error: 'Error saving teacher', details: err }));
};

/**
 * Get all teachers or a specific teacher by ID
 */
const teacherGet = (req, res) => {
  if (req.params.id) {
    Teacher.findById(req.params.id)
      .then(teacher => teacher ? res.json(teacher) : res.status(404).json({ error: "Teacher not found" }))
      .catch(err => res.status(500).json({ error: "Error fetching teacher", details: err }));
  } else {
    Teacher.find()
      .then(teachers => res.json(teachers))
      .catch(err => res.status(500).json({ error: "Error fetching teachers", details: err }));
  }
};

/**
 * Updates a teacher by ID
 */


// Editar un maestro por su ID
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Maestro no encontrado' });
    }

    res.status(200).json({ message: 'Maestro actualizado correctamente', teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el maestro', error: error.message });
  }
};

/**
 * Deletes a teacher by ID
 */
const teacherDelete = (req, res) => {
  Teacher.findByIdAndDelete(req.params.id)
    .then(deletedTeacher => deletedTeacher ? res.json({ message: "Teacher deleted" }) : res.status(404).json({ error: "Teacher not found" }))
    .catch(err => res.status(500).json({ error: "Error deleting teacher", details: err }));
};

module.exports = {
  teacherCreate,
  teacherGet,
  teacherDelete,
  updateTeacher
}
