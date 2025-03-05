const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 18 } // Se asume que un maestro debe tener al menos 18 años
});

module.exports = mongoose.model('Teacher', teacherSchema);