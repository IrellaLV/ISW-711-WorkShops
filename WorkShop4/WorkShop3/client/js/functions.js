const API_URL = "http://localhost:3001/teachers";
const COURSE_API_URL = "http://localhost:3001/courses";

/**
 * Create a new teacher
 */
async function createTeacher() {
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const cedula = document.getElementById('cedula').value;
  const age = document.getElementById('age').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, cedula, age })
    });

    if (response.ok) {
      alert('Teacher created successfully!');
      getTeachers();
    } else {
      alert('Failed to create teacher.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Get all teachers
 */
async function getTeachers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error fetching teachers");
    }

    const teachers = await response.json();
    renderTeachersDropdown(teachers);
  } catch (error) {
    console.error("Error loading teachers:", error);
  }
}
async function getTeacherssss() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error fetching teachers");
    }

    const teachers = await response.json();
    renderTeachers(teachers);
  } catch (error) {
    console.error("Error loading teachers:", error);
  }
}

function renderTeachersDropdown(teachers) {
  const teacherSelect = document.getElementById("teacher");
  teacherSelect.innerHTML = "<option value='' disabled selected>Select a teacher</option>"; // Default option

  teachers.forEach(teacher => {
    const option = document.createElement("option");
    option.value = teacher._id;
    option.textContent = `${teacher.first_name} ${teacher.last_name}`;
    teacherSelect.appendChild(option);
  });
}

/**
 * Render teachers list
 */
function renderTeachers(teachers) {
  let list = document.getElementById("teacherList");
  list.innerHTML = "";

  teachers.forEach(teacher => {
    let item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <span>${teacher.first_name} ${teacher.last_name} - ${teacher.age} years - ${teacher.cedula}</span>
      <div>
        <button class="btn btn-warning btn-sm" onclick="editTeacher('${teacher._id}', '${teacher.first_name}', '${teacher.last_name}', '${teacher.age}', '${teacher.cedula}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${teacher._id}')">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function editTeacher(id, firstName, lastName, age, cedula) {
  document.getElementById("first_name").value = firstName;
  document.getElementById("last_name").value = lastName;
  document.getElementById("age").value = age;
  document.getElementById("cedula").value = cedula;

  // Store the ID in a data attribute to update later
  document.getElementById("teacherForm").setAttribute("data-id", id);

  // Change the button to "Update"
  let submitButton = document.getElementById("submitButton");
  submitButton.innerText = "Update Teacher";
  submitButton.setAttribute("onclick", "updateTeacher()");
}

async function updateTeacher() {
  const id = document.getElementById("teacherForm").getAttribute("data-id");
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const age = document.getElementById('age').value;
  const cedula = document.getElementById('cedula').value;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, age, cedula })
    });

    if (response.ok) {
      alert("Teacher updated successfully!");
      document.getElementById("teacherForm").reset();
      document.getElementById("teacherForm").removeAttribute("data-id");
      document.getElementById("submitButton").innerText = "Create Teacher";
      document.getElementById("submitButton").setAttribute("onclick", "createTeacher()");
      getTeachers();
    } else {
      alert("Failed to update teacher.");
    }
  } catch (error) {
    console.error("Error updating teacher:", error);
  }
}

/**
 * Delete a teacher
 */
async function deleteTeacher(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert("Teacher deleted successfully!");
      getTeachers();
    } else {
      alert("Failed to delete teacher.");
    }
  } catch (error) {
    console.error("Error deleting teacher:", error);
  }
}


// Obtener y cargar la lista de profesores en el formulario
async function loadTeachers() {
    try {
        const response = await fetch(API_URL);  // Corrected the URL
        const teachers = await response.json();
        const teacherSelect = document.getElementById("teacher");

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

// Crear un curso
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
        getCourses(); // Recargar la lista de cursos
    } catch (error) {
        console.error("Error:", error);
    }
}

// Obtener y mostrar todos los cursos
async function getCourses() {
  try {
      const response = await fetch(COURSE_API_URL);  // Fixed the URL here
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

// Editar un curso
async function editCourse(id) {
    const newName = prompt("Enter new course name:");
    const newCode = prompt("Enter new course code:");
    const newDescription = prompt("Enter new description:");
    const newTeacherId = prompt("Enter new teacher ID:");

    if (!newName || !newCode || !newDescription || !newTeacherId) return;

    const updatedCourse = { name: newName, code: newCode, description: newDescription, teacherId: newTeacherId };

    try {
        const response = await fetch(`${COURSE_API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCourse)
        });

        if (!response.ok) {
            throw new Error("Error updating course");
        }

        alert("Course updated successfully!");
        getCourses();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Eliminar un curso
async function deleteCourse(id) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
        const response = await fetch(`${COURSE_API_URL}/${id}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Error deleting course");
        }

        alert("Course deleted successfully!");
        getCourses();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Cargar los profesores y la lista de cursos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    loadTeachers();
    getCourses();
});