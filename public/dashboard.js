const API_URL = 'http://localhost:3000/api';

// Tab Navigation
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${tabName}-tab`).classList.add('active');
  event.target.classList.add('active');

  if (tabName === 'students') loadStudents();
  else if (tabName === 'courses') loadCourses();
  else if (tabName === 'enrollments') loadEnrollmentSelects();
  else if (tabName === 'grades') loadGradeSelects();
  else if (tabName === 'reports') loadReportSelects();
}

// ============ STUDENTS ============
document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById('studentName').value,
    email: document.getElementById('studentEmail').value,
    phone: document.getElementById('studentPhone').value,
    dateOfBirth: document.getElementById('studentDOB').value,
    address: document.getElementById('studentAddress').value,
    parentName: document.getElementById('parentName').value,
    parentEmail: document.getElementById('parentEmail').value,
  };

  try {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });

    if (response.ok) {
      alert('Student registered successfully!');
      document.getElementById('studentForm').reset();
      loadStudents();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/students`);
    const students = await response.json();

    let html = '<ul class="list">';
    students.forEach(student => {
      html += `
        <li class="list-item">
          <div class="item-header">
            <h4>${student.name}</h4>
            <span class="status-badge ${student.status}">${student.status}</span>
          </div>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
          <p><strong>Enrollment Date:</strong> ${student.enrollmentDate}</p>
          <div class="item-actions">
            <button onclick="editStudent('${student.id}')" class="btn-secondary">Edit</button>
            <button onclick="deleteStudent('${student.id}')" class="btn-danger">Delete</button>
            <button onclick="viewStudentDetails('${student.id}')" class="btn-secondary">Details</button>
          </div>
        </li>
      `;
    });
    html += '</ul>';

    document.getElementById('studentsList').innerHTML = html || '<p>No students registered</p>';

    // Update dropdowns
    updateSelectOptions('enrollmentStudent', students, 'id', 'name');
    updateSelectOptions('filterStudent', students, 'id', 'name');
    updateSelectOptions('gradeStudent', students, 'id', 'name');
    updateSelectOptions('filterStudentGrades', students, 'id', 'name');
    updateSelectOptions('reportStudent', students, 'id', 'name');
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

function updateSelectOptions(selectId, items, valueField, labelField) {
  const select = document.getElementById(selectId);
  const currentValue = select.value;
  select.innerHTML = `<option value="">Select an option</option>`;
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueField];
    option.textContent = item[labelField];
    select.appendChild(option);
  });
  select.value = currentValue;
}

async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  try {
    const response = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Student deleted successfully');
      loadStudents();
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// ============ COURSES ============
document.getElementById('courseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const course = {
    name: document.getElementById('courseName').value,
    code: document.getElementById('courseCode').value,
    instructor: document.getElementById('instructor').value,
    credits: parseInt(document.getElementById('credits').value) || 3,
    semester: document.getElementById('semester').value,
    maxStudents: parseInt(document.getElementById('maxStudents').value) || 50,
    description: document.getElementById('description').value,
  };

  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });

    if (response.ok) {
      alert('Course created successfully!');
      document.getElementById('courseForm').reset();
      loadCourses();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

async function loadCourses() {
  try {
    const response = await fetch(`${API_URL}/courses`);
    const courses = await response.json();

    let html = '<ul class="list">';
    courses.forEach(course => {
      html += `
        <li class="list-item">
          <div class="item-header">
            <h4>${course.name} (${course.code})</h4>
          </div>
          <p><strong>Instructor:</strong> ${course.instructor}</p>
          <p><strong>Credits:</strong> ${course.credits} | <strong>Max Students:</strong> ${course.maxStudents}</p>
          <p><strong>Semester:</strong> ${course.semester}</p>
          <p><strong>Description:</strong> ${course.description || 'N/A'}</p>
        </li>
      `;
    });
    html += '</ul>';

    document.getElementById('coursesList').innerHTML = html || '<p>No courses available</p>';

    // Update dropdowns
    updateSelectOptions('enrollmentCourse', courses, 'id', 'name');
    updateSelectOptions('gradeCourse', courses, 'id', 'name');
    updateSelectOptions('reportCourse', courses, 'id', 'name');
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// ============ ENROLLMENTS ============
document.getElementById('enrollmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const enrollment = {
    studentId: document.getElementById('enrollmentStudent').value,
    courseId: document.getElementById('enrollmentCourse').value,
  };

  try {
    const response = await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrollment),
    });

    if (response.ok) {
      alert('Student enrolled successfully!');
      document.getElementById('enrollmentForm').reset();
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

function loadEnrollmentSelects() {
  loadStudents();
  loadCourses();
}

async function loadStudentEnrollments() {
  const studentId = document.getElementById('filterStudent').value;
  if (!studentId) {
    document.getElementById('enrollmentsList').innerHTML = '<p>Select a student to view enrollments</p>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/students/${studentId}/enrollments`);
    const enrollments = await response.json();

    let html = '<ul class="list">';
    enrollments.forEach(enrollment => {
      html += `
        <li class="list-item">
          <h4>${enrollment.courseName} (${enrollment.courseCode})</h4>
          <p><strong>Credits:</strong> ${enrollment.credits}</p>
          <p><strong>Status:</strong> ${enrollment.status}</p>
          <p><strong>Grade:</strong> ${enrollment.grade || 'Not graded yet'}</p>
        </li>
      `;
    });
    html += '</ul>';

    document.getElementById('enrollmentsList').innerHTML = html || '<p>No enrollments found</p>';
  } catch (error) {
    console.error('Error loading enrollments:', error);
  }
}

// ============ GRADES ============
document.getElementById('gradeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const grade = {
    studentId: document.getElementById('gradeStudent').value,
    courseId: document.getElementById('gradeCourse').value,
    assignment: document.getElementById('assignment').value,
    score: parseFloat(document.getElementById('score').value),
    maxScore: parseFloat(document.getElementById('maxScore').value),
    weight: parseFloat(document.getElementById('weight').value) || 1,
  };

  try {
    const response = await fetch(`${API_URL}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade),
    });

    if (response.ok) {
      alert('Grade recorded successfully!');
      document.getElementById('gradeForm').reset();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

function loadGradeSelects() {
  loadStudents();
  loadCourses();
}

async function loadStudentGrades() {
  const studentId = document.getElementById('filterStudentGrades').value;
  if (!studentId) {
    document.getElementById('gradesList').innerHTML = '<p>Select a student to view grades</p>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/students/${studentId}/grades`);
    const grades = await response.json();

    let html = '<ul class="list">';
    grades.forEach(grade => {
      const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
      html += `
        <li class="list-item">
          <h4>${grade.courseName}</h4>
          <p><strong>Assignment:</strong> ${grade.assignment || 'General Assessment'}</p>
          <p><strong>Score:</strong> ${grade.score} / ${grade.maxScore} (${percentage}%)</p>
          <p><strong>Recorded:</strong> ${new Date(grade.recordedDate).toLocaleDateString()}</p>
        </li>
      `;
    });
    html += '</ul>';

    document.getElementById('gradesList').innerHTML = html || '<p>No grades recorded</p>';
  } catch (error) {
    console.error('Error loading grades:', error);
  }
}

// ============ REPORTS ============
function loadReportSelects() {
  loadStudents();
  loadCourses();
}

async function generateStudentReport() {
  const studentId = document.getElementById('reportStudent').value;
  if (!studentId) {
    alert('Please select a student');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/reports/student/${studentId}`);
    const report = await response.json();

    let html = `
      <div class="report">
        <h4>${report.student.name}</h4>
        <p><strong>Email:</strong> ${report.student.email}</p>
        <p><strong>Current GPA:</strong> ${report.currentSemester?.gpa || 'N/A'}</p>
        <p><strong>Enrollment Date:</strong> ${report.student.enrollmentDate}</p>
        
        <h5>Enrollments (${report.enrollments.length})</h5>
        <ul>
          ${report.enrollments.map(e => `<li>${e.courseName} (${e.courseCode}) - ${e.credits} credits - Grade: ${e.grade || 'In Progress'}</li>`).join('')}
        </ul>
        
        <h5>Recent Grades</h5>
        <ul>
          ${report.grades.slice(0, 10).map(g => `
            <li>${g.courseName}: ${g.assignment || 'Assessment'} - ${((g.score/g.maxScore)*100).toFixed(1)}%</li>
          `).join('')}
        </ul>
      </div>
    `;

    document.getElementById('studentReport').innerHTML = html;
  } catch (error) {
    alert(`Error generating report: ${error.message}`);
  }
}

async function generateClassReport() {
  const courseId = document.getElementById('reportCourse').value;
  if (!courseId) {
    alert('Please select a course');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/reports/class/${courseId}`);
    const report = await response.json();

    let html = `
      <div class="report">
        <h4>${report.course.name} (${report.course.code})</h4>
        <p><strong>Instructor:</strong> ${report.course.instructor}</p>
        <p><strong>Students Enrolled:</strong> ${report.studentCount}</p>
        <p><strong>Credits:</strong> ${report.course.credits}</p>
        
        <h5>Enrolled Students</h5>
        <ul>
          ${report.enrollments.map(e => `
            <li>${e.studentName} - ${e.status} - Grade: ${e.grade || 'N/A'}</li>
          `).join('')}
        </ul>
      </div>
    `;

    document.getElementById('classReport').innerHTML = html;
  } catch (error) {
    alert(`Error generating report: ${error.message}`);
  }
}

async function generateInstitutionalReport() {
  try {
    const response = await fetch(`${API_URL}/reports/institutional`);
    const report = await response.json();

    const html = `
      <div class="report">
        <h4>Institutional Overview Report</h4>
        <p><strong>Total Students:</strong> ${report.totalStudents}</p>
        <p><strong>Total Courses:</strong> ${report.totalCourses}</p>
        <p><strong>Total Enrollments:</strong> ${report.totalEnrollments}</p>
        <p><strong>Average GPA:</strong> ${report.averageGPA.toFixed(2)}</p>
        <p><strong>Generated:</strong> ${new Date(report.generatedDate).toLocaleString()}</p>
      </div>
    `;

    document.getElementById('institutionalReport').innerHTML = html;
  } catch (error) {
    alert(`Error generating report: ${error.message}`);
  }
}

// Load initial data
loadStudents();
