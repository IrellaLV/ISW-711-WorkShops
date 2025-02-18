const API_URL = "http://localhost:3001/courses";

/**
 * Cargar todos los cursos
 */
async function getCourses() {
  try {
    const response = await fetch(API_URL);
    const courses = await response.json();
    renderCourses(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

/**
 * Mostrar la lista de cursos
 */
function renderCourses(courses) {
  let list = document.getElementById("courseList");
  list.innerHTML = "";

  courses.forEach(course => {
    let item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <span>${course.name} (${course.code}) - ${course.teacher.first_name} ${course.teacher.last_name}</span>
      <div>
        <button class="btn btn-warning btn-sm" onclick="editCourse('${course._id}', '${course.name}', '${course.code}', '${course.description}', '${course.teacher._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

/**
 * Crear un curso
 */
async function createCourse() {
  const name = document.getElementById('name').value;
  const code = document.getElementById('code').value;
  const description = document.getElementById('description').value;
  const teacherId = document.getElementById('teacher').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, description, teacherId })
    });

    if (response.ok) {
      alert('Course created successfully!');
      getCourses();
    } else {
      alert('Failed to create course');
    }
  } catch (error) {
    console.error('Error creating course:', error);
  }
}

/**
 * Editar un curso
 */
async function editCourse(id, name, code, description, teacherId) {
  document.getElementById("name").value = name;
  document.getElementById("code").value = code;
  document.getElementById("description").value = description;
  document.getElementById("teacher").value = teacherId;

  document.getElementById("courseForm").setAttribute("data-id", id);
  document.getElementById("submitButton").innerText = "Update Course";
  document.getElementById("submitButton").setAttribute("onclick", "updateCourse()");
}

/**
 * Actualizar un curso
 */
async function updateCourse() {
  const id = document.getElementById("courseForm").getAttribute("data-id");
  const name = document.getElementById('name').value;
  const code = document.getElementById('code').value;
  const description = document.getElementById('description').value;
  const teacherId = document.getElementById('teacher').value;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, description, teacherId })
    });

    if (response.ok) {
      alert("Course updated successfully!");
      getCourses();
    } else {
      alert("Failed to update course");
    }
  } catch (error) {
    console.error("Error updating course:", error);
  }
}

/**
 * Eliminar un curso
 */
async function deleteCourse(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (response.ok) {
      alert("Course deleted successfully!");
      getCourses();
    } else {
      alert("Failed to delete course");
    }
  } catch (error) {
    console.error("Error deleting course:", error);
  }
}