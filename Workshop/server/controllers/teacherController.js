const Teacher = require("../models/teacherModel");


/**
 * Creates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherCreate = (req, res) => {
  let teacher = new Teacher();

  teacher.first_name = req.body.first_name;
  teacher.last_name = req.body.last_name;
  teacher.age = req.body.age;
  teacher.cedula = req.body.cedula;

  if (teacher.first_name && teacher.last_name) {
    teacher.save()
      .then(() => {
        res.status(201); // CREATED
        res.header({
          'location': `/teachers/?id=${teacher.id}`
        });
        res.json(teacher);
      })
      .catch((err) => {
        res.status(422);
        console.log('error while saving the teacher', err);
        res.json({
          error: 'There was an error saving the teacher'
        });
    });
  } else {
    res.status(422);
    console.log('error while saving the teacher')
    res.json({
      error: 'No valid data provided for teacher'
    });
  }
};

/**
 * Get all teachers
 *
 * @param {*} req
 * @param {*} res
 */
const teacherGet = (req, res) => {
  // if an specific teacher is required
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id)
      .then(teacher => {
        if(teacher) {
          res.json(teacher);
        }
        res.status(404);
        res.json({ error: "Teacher doesnt exist" })
      })
      .catch( (err) => {
        res.status(500);
        console.log('error while queryting the teacher', err)
        res.json({ error: "There was an error" })
      });
  } else {
    // get all teachers
    Teacher.find()
      .then(teachers => {
        res.json(teachers);
      })
      .catch(err => {
        res.status(422);
        res.json({ "error": err });
      });
  }
};

/**
 * Updates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherUpdate = (req, res) => {
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id)
      .then(teacher => {
        if (teacher) {
          // Update fields if they exist in the request body
          teacher.first_name = req.body.first_name || teacher.first_name;
          teacher.last_name = req.body.last_name || teacher.last_name;
          teacher.age = req.body.age || teacher.age;
          teacher.cedula = req.body.cedula || teacher.cedula;

          teacher.save()
            .then(updatedTeacher => {
              res.status(200).json(updatedTeacher);
            })
            .catch(err => {
              res.status(422).json({ error: 'Error updating teacher' });
            });
        } else {
          res.status(404).json({ error: 'Teacher not found' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Error finding teacher' });
      });
  } else {
    res.status(400).json({ error: 'ID query parameter is required' });
  }
};

/**
 * Deletes a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherDelete = (req, res) => {
  if (req.query && req.query.id) {
    Teacher.findByIdAndDelete(req.query.id)
      .then(deletedTeacher => {
        if (deletedTeacher) {
          res.status(200).json({ message: 'Teacher deleted successfully' });
        } else {
          res.status(404).json({ error: 'Teacher not found' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Error deleting teacher' });
      });
  } else {
    res.status(400).json({ error: 'ID query parameter is required' });
  }
};

module.exports = {
  teacherCreate,
  teacherGet,
  teacherDelete,
  teacherUpdate
}
