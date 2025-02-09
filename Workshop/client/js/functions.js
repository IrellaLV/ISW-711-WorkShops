const API_URL = "http://localhost:3001/teachers";

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
    const teachers = await response.json();

    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = ''; // Clear the existing list

    teachers.forEach(teacher => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = `${teacher.first_name} ${teacher.last_name} (Age: ${teacher.age})`;

      // Add Update and Delete buttons
      const actions = document.createElement('div');
      const updateBtn = document.createElement('button');
      updateBtn.className = 'btn btn-warning btn-sm me-2';
      updateBtn.textContent = 'Update';
      updateBtn.id = `updateBtn-${teacher._id}`; // Set a unique id for each button
      updateBtn.onclick = () => updateTeacher(teacher._id);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.textContent = 'Delete';
      deleteBtn.id = `deleteBtn-${teacher._id}`; // Set a unique id for each button
      deleteBtn.onclick = () => deleteTeacher(teacher._id);

      actions.appendChild(updateBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(actions);

      teacherList.appendChild(li);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Update a teacher
async function updateTeacher(id) {
  const newFirstName = prompt('Enter new first name:');
  const newLastName = prompt('Enter new last name:');
  const newAge = prompt('Enter new age:');
  const newCedula = prompt('Enter new cedula:');

  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: newFirstName, last_name: newLastName, age: newAge, cedula: newCedula })
    });

    if (response.ok) {
      alert('Teacher updated successfully!');
      getTeachers(); // Refresh the teacher list after updating
    } else {
      alert('Failed to update teacher.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Delete a teacher
async function deleteTeacher(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Teacher deleted successfully!');
      getTeachers(); // Refresh the teacher list after deleting
    } else {
      alert('Failed to delete teacher.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}