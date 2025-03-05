const API_URL = "http://localhost:3001/teachers";
const COURSE_API_URL = "http://localhost:3001/courses";

/**
 * Load teachers for the course creation dropdown
 */
async function loadTeachers() {
    try {
        const response = await fetch(API_URL);  
        const teachers = await response.json();
        const teacherSelect = document.getElementById("teacher");

        teacherSelect.innerHTML = "<option value='' disabled selected>Select a teacher</option>"; // Default option

        teachers.forEach(teacher => {
            const option = document.createElement("option");
            option.value = teacher._id;
            option.textContent = `${teacher.first_name} ${teacher.last_name}`;
            teacherSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading teachers:", error);
    }
}

/**
 * Create a course
 */
async function createCourse() {
    const name = document.getElementById("name").value;
    const code = document.getElementById("code").value;
    const description = document.getElementById("description").value;
    const teacherId = document.getElementById("teacher").value;

    if (!name || !code || !description || !teacherId) {
        alert("Please fill out all the fields!");
        return;
    }

    const courseData = { name, code, description, teacherId };

    try {
        const response = await fetch(COURSE_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courseData)
        });

        if (!response.ok) {
            throw new Error("Error creating course");
        }

        alert("Course created successfully!");
        getCourses(); // Reload the course list
    } catch (error) {
        console.error("Error:", error);
    }
}

/**
 * Edit a course and populate the form fields with the course data
 */
// Editar un curso
async function editCourse(id) {
  // Obtener los datos del curso seleccionado
  try {
      const response = await fetch(`${COURSE_API_URL}/${id}`);
      const course = await response.json();

      if (!course) {
          alert("Course not found!");
          return;
      }

      // Rellenar el formulario con los valores del curso seleccionado
      document.getElementById("name").value = course.name;
      document.getElementById("code").value = course.code;
      document.getElementById("description").value = course.description;

      // Establecer el profesor seleccionado
      const teacherSelect = document.getElementById("teacher");
      teacherSelect.value = course.teacherId; // Asegúrate de que esta propiedad coincida con tu API

      // Cambiar el texto y la acción del botón de "Crear Curso" a "Actualizar Curso"
      const submitButton = document.getElementById("submitButton");
      submitButton.innerText = "Update Course";
      submitButton.setAttribute("onclick", `updateCourse('${id}')`);  // Llamada a updateCourse con el ID del curso
  } catch (error) {
      console.error("Error fetching course:", error);
  }
}

// Actualizar un curso
async function updateCourse(id) {
  const name = document.getElementById("name").value;
  const code = document.getElementById("code").value;
  const description = document.getElementById("description").value;
  const teacherId = document.getElementById("teacher").value;

  if (!name || !code || !description || !teacherId) {
      alert("Please fill out all the fields!");
      return;
  }

  const updatedCourse = { name, code, description, teacherId };

  try {
      const response = await fetch(`${COURSE_API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCourse)
      });

      if (response.ok) {
          alert("Course updated successfully!");
          getCourses(); // Recargar la lista de cursos
          resetForm(); // Resetear el formulario
      } else {
          throw new Error("Error updating course");
      }
  } catch (error) {
      console.error("Error:", error);
  }
}

// Resetear el formulario después de la actualización
function resetForm() {
  document.getElementById("courseForm").reset();
  const submitButton = document.getElementById("submitButton");
  submitButton.innerText = "Create Course";
  submitButton.setAttribute("onclick", "createCourse()");  // Volver a la acción de creación de curso
}
/**
 * Delete a course
 */
async function deleteCourse(id) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
        const response = await fetch(`${COURSE_API_URL}/${id}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Error deleting course");
        }

        alert("Course deleted successfully!");
        getCourses(); // Reload the course list
    } catch (error) {
        console.error("Error deleting course:", error);
    }
}

/**
 * Get and display all courses
 */
async function getCourses() {
    try {
        const response = await fetch(COURSE_API_URL);
        const courses = await response.json();
        const courseList = document.getElementById("courseList");

        courseList.innerHTML = ""; // Clear the list before reloading it

        if (courses.length === 0) {
            courseList.innerHTML = "<li>No courses available.</li>";
        }

        courses.forEach(course => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.innerHTML = `
                <strong>${course.name}</strong> (${course.code}) - ${course.description} <br>
                <em>Professor: ${course.teacher?.first_name || "Unknown"} ${course.teacher?.last_name || ""}</em>
                <br>
                <button class="btn btn-warning btn-sm mt-2" onclick="editCourse('${course._id}')">Edit</button>
                <button class="btn btn-danger btn-sm mt-2" onclick="deleteCourse('${course._id}')">Delete</button>
            `;
            courseList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

// Load teachers and courses on page load
document.addEventListener("DOMContentLoaded", () => {
    loadTeachers();
    getCourses();
});