// Initial Seed Data for Student Management Dashboard
const INITIAL_STUDENTS = [
  {
    id: "s1",
    rollNo: "STU-2024-001",
    name: "Elena Rostova",
    email: "elena.rostova@campus.edu",
    phone: "+1 (555) 234-5678",
    department: "Computer Science",
    year: "3rd Year",
    status: "Active",
    admissionDate: "2022-08-15"
  },
  {
    id: "s2",
    rollNo: "STU-2024-002",
    name: "Marcus Vance",
    email: "marcus.vance@campus.edu",
    phone: "+1 (555) 345-6789",
    department: "Data Science",
    year: "2nd Year",
    status: "Active",
    admissionDate: "2023-08-20"
  },
  {
    id: "s3",
    rollNo: "STU-2024-003",
    name: "Sophia Chen",
    email: "sophia.chen@campus.edu",
    phone: "+1 (555) 456-7890",
    department: "Electrical Engineering",
    year: "4th Year",
    status: "Active",
    admissionDate: "2021-08-18"
  },
  {
    id: "s4",
    rollNo: "STU-2024-004",
    name: "Liam O'Connor",
    email: "liam.oc@campus.edu",
    phone: "+1 (555) 567-8901",
    department: "Business Administration",
    year: "2nd Year",
    status: "Probation",
    admissionDate: "2023-01-10"
  },
  {
    id: "s5",
    rollNo: "STU-2024-005",
    name: "Amara Diallo",
    email: "amara.diallo@campus.edu",
    phone: "+1 (555) 678-9012",
    department: "Computer Science",
    year: "4th Year",
    status: "Graduated",
    admissionDate: "2020-08-25"
  }
];

const COURSES = [
  { id: "c1", code: "CS301", title: "Data Structures & Algorithms", credits: 4, dept: "Computer Science" },
  { id: "c2", code: "DS202", title: "Applied Machine Learning", credits: 3, dept: "Data Science" },
  { id: "c3", code: "EE105", title: "Circuit Analysis & Systems", credits: 4, dept: "Electrical Engineering" },
  { id: "c4", code: "BA402", title: "Strategic Operations Management", credits: 3, dept: "Business Administration" },
  { id: "c5", code: "CS405", title: "Distributed Systems & Cloud", credits: 4, dept: "Computer Science" },
  { id: "c6", code: "MATH201", title: "Linear Algebra & Statistics", credits: 3, dept: "Computer Science" }
];

const GRADE_POINTS = {
  "A+": 4.0,
  "A": 3.8,
  "B+": 3.3,
  "B": 3.0,
  "C+": 2.5,
  "C": 2.0,
  "F": 0.0
};

const INITIAL_ENROLLMENTS = [
  { id: "en-1", studentId: "s1", courseId: "c1", semester: "Fall 2024", grade: "A+", attendance: 96, status: "Completed" },
  { id: "en-2", studentId: "s1", courseId: "c5", semester: "Fall 2024", grade: "A", attendance: 92, status: "Completed" },
  { id: "en-3", studentId: "s2", courseId: "c2", semester: "Fall 2024", grade: "A", attendance: 95, status: "Completed" },
  { id: "en-4", studentId: "s2", courseId: "c6", semester: "Fall 2024", grade: "B+", attendance: 88, status: "Completed" },
  { id: "en-5", studentId: "s3", courseId: "c3", semester: "Fall 2024", grade: "A+", attendance: 98, status: "Completed" },
  { id: "en-6", studentId: "s4", courseId: "c4", semester: "Fall 2024", grade: "C", attendance: 75, status: "Completed" },
  { id: "en-7", studentId: "s5", courseId: "c1", semester: "Spring 2024", grade: "A", attendance: 94, status: "Completed" },
  { id: "en-8", studentId: "s5", courseId: "c5", semester: "Spring 2024", grade: "A+", attendance: 97, status: "Completed" }
];

// App State
let students = JSON.parse(localStorage.getItem("edutrack_students")) || INITIAL_STUDENTS;
let enrollments = JSON.parse(localStorage.getItem("edutrack_enrollments")) || INITIAL_ENROLLMENTS;
let courses = JSON.parse(localStorage.getItem("edutrack_courses")) || COURSES;

function saveState() {
  localStorage.setItem("edutrack_students", JSON.stringify(students));
  localStorage.setItem("edutrack_enrollments", JSON.stringify(enrollments));
  localStorage.setItem("edutrack_courses", JSON.stringify(courses));
}

// Helpers
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function calculateStudentGPA(studentId) {
  const stEnrollments = enrollments.filter(e => e.studentId === studentId && e.grade && GRADE_POINTS[e.grade] !== undefined);
  if (stEnrollments.length === 0) return 0.0;

  let totalPoints = 0;
  let totalCredits = 0;

  stEnrollments.forEach(en => {
    const course = courses.find(c => c.id === en.courseId);
    const credits = course ? course.credits : 3;
    totalPoints += GRADE_POINTS[en.grade] * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

function getStudentAttendance(studentId) {
  const stEnrollments = enrollments.filter(e => e.studentId === studentId && e.attendance !== undefined);
  if (stEnrollments.length === 0) return 0;
  const sum = stEnrollments.reduce((acc, curr) => acc + Number(curr.attendance), 0);
  return Math.round(sum / stEnrollments.length);
}

// Tab Navigation
function setupTabs() {
  const navButtons = document.querySelectorAll(".nav-item");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });

  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });

  const titles = {
    dashboard: { title: "Dashboard Overview", sub: "Real-time academic telemetry and student administration" },
    students: { title: "Student Directory", sub: "Manage and register students across faculties" },
    enrollments: { title: "Enrollment Center", sub: "Course assignments, capacity and terms" },
    grades: { title: "Academic Progress & Standing", sub: "Record grades and monitor performance metrics" },
    reports: { title: "Performance Reports & Transcripts", sub: "Export institutional audits and certified transcripts" }
  };

  if (titles[tabId]) {
    document.getElementById("pageTitle").textContent = titles[tabId].title;
    document.getElementById("pageSubtitle").textContent = titles[tabId].sub;
  }

  // Refresh Views
  renderAll();
}

// Render Dashboard
function renderDashboard() {
  // Stats
  document.getElementById("statTotalStudents").textContent = students.length;
  document.getElementById("statTotalCourses").textContent = courses.length;
  document.getElementById("statTotalEnrollments").textContent = enrollments.length;

  // Aggregate GPA
  let totalGpa = 0;
  students.forEach(s => {
    totalGpa += parseFloat(calculateStudentGPA(s.id));
  });
  const avgGpa = students.length > 0 ? (totalGpa / students.length).toFixed(2) : "0.00";
  document.getElementById("statAverageGPA").textContent = avgGpa;

  // GPA Distribution
  const brackets = { "3.5 - 4.0 (Dean's List)": 0, "3.0 - 3.49 (Good)": 0, "2.0 - 2.99 (Average)": 0, "< 2.0 (Probation)": 0 };
  students.forEach(s => {
    const gpa = parseFloat(calculateStudentGPA(s.id));
    if (gpa >= 3.5) brackets["3.5 - 4.0 (Dean's List)"]++;
    else if (gpa >= 3.0) brackets["3.0 - 3.49 (Good)"]++;
    else if (gpa >= 2.0) brackets["2.0 - 2.99 (Average)"]++;
    else brackets["< 2.0 (Probation)"]++;
  });

  const gpaContainer = document.getElementById("gpaDistribution");
  gpaContainer.innerHTML = "";
  Object.entries(brackets).forEach(([bracket, count]) => {
    const pct = students.length > 0 ? (count / students.length) * 100 : 0;
    const row = document.createElement("div");
    row.className = "dist-row";
    row.innerHTML = `
      <span class="dist-label">${bracket}</span>
      <div class="dist-bar-bg">
        <div class="dist-bar-fill" style="width: ${pct}%"></div>
      </div>
      <span class="dist-count">${count}</span>
    `;
    gpaContainer.appendChild(row);
  });

  // Department Breakdown
  const deptCounts = {};
  students.forEach(s => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
  });
  const deptContainer = document.getElementById("deptDistribution");
  deptContainer.innerHTML = "";
  Object.entries(deptCounts).forEach(([dept, count]) => {
    const item = document.createElement("div");
    item.className = "dept-item";
    item.innerHTML = `
      <span>🏛️ ${dept}</span>
      <strong>${count} students</strong>
    `;
    deptContainer.appendChild(item);
  });

  // Recent Students
  const recentTable = document.getElementById("recentStudentsTable");
  recentTable.innerHTML = "";
  const recent = [...students].slice(-4).reverse();
  recent.forEach(s => {
    const gpa = calculateStudentGPA(s.id);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${s.rollNo}</strong></td>
      <td>${s.name}</td>
      <td>${s.department}</td>
      <td>${s.year}</td>
      <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
      <td><strong>${gpa}</strong></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="viewStudentReport('${s.id}')">Transcript</button>
      </td>
    `;
    recentTable.appendChild(tr);
  });
}

// Render Students Table
function renderStudentsTable() {
  const table = document.getElementById("studentsFullTable");
  const filterDept = document.getElementById("filterDept").value;
  const filterStatus = document.getElementById("filterStatus").value;
  const searchQuery = document.getElementById("globalSearch").value.toLowerCase();

  table.innerHTML = "";

  const filtered = students.filter(s => {
    const matchesDept = !filterDept || s.department === filterDept;
    const matchesStatus = !filterStatus || s.status === filterStatus;
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery) || 
      s.rollNo.toLowerCase().includes(searchQuery) ||
      s.department.toLowerCase().includes(searchQuery);
    return matchesDept && matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-muted);">No student records matched criteria.</td></tr>`;
    return;
  }

  filtered.forEach(s => {
    const gpa = calculateStudentGPA(s.id);
    const studentEnrollments = enrollments.filter(e => e.studentId === s.id);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${s.rollNo}</strong></td>
      <td>
        <div><strong>${s.name}</strong></div>
        <small class="text-muted">${s.email}</small>
      </td>
      <td>${s.department}</td>
      <td>${s.year}</td>
      <td><span style="font-weight:700; color: ${gpa >= 3.5 ? 'var(--success)' : (gpa < 2.0 ? 'var(--danger)' : 'var(--text)')}">${gpa}</span></td>
      <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
      <td>${studentEnrollments.length} Course(s)</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm btn-outline" onclick="openStudentModal('${s.id}')">Edit</button>
          <button class="btn btn-sm btn-outline" onclick="viewStudentReport('${s.id}')">Report</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent('${s.id}')">✕</button>
        </div>
      </td>
    `;
    table.appendChild(tr);
  });
}

// Student Modal Management
function openStudentModal(studentId = null) {
  const modal = document.getElementById("studentModal");
  const modalTitle = document.getElementById("modalTitle");
  const form = document.getElementById("studentForm");

  form.reset();

  if (studentId) {
    const s = students.find(item => item.id === studentId);
    if (s) {
      modalTitle.textContent = "Edit Student Profile";
      document.getElementById("studentId").value = s.id;
      document.getElementById("studentName").value = s.name;
      document.getElementById("studentEmail").value = s.email;
      document.getElementById("studentRoll").value = s.rollNo;
      document.getElementById("studentPhone").value = s.phone || "";
      document.getElementById("studentDept").value = s.department;
      document.getElementById("studentYear").value = s.year;
      document.getElementById("studentStatus").value = s.status;
      document.getElementById("studentAdmissionDate").value = s.admissionDate || "";
    }
  } else {
    modalTitle.textContent = "Register New Student";
    document.getElementById("studentId").value = "";
    document.getElementById("studentRoll").value = `STU-2024-${String(students.length + 1).padStart(3, "0")}`;
    document.getElementById("studentAdmissionDate").value = new Date().toISOString().split("T")[0];
  }

  modal.classList.add("open");
}

function closeStudentModal() {
  document.getElementById("studentModal").classList.remove("open");
}

function handleSaveStudent(event) {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const rollNo = document.getElementById("studentRoll").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();
  const department = document.getElementById("studentDept").value;
  const year = document.getElementById("studentYear").value;
  const status = document.getElementById("studentStatus").value;
  const admissionDate = document.getElementById("studentAdmissionDate").value;

  if (id) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], name, email, rollNo, phone, department, year, status, admissionDate };
      showToast("Student updated successfully.");
    }
  } else {
    const newStudent = {
      id: "s_" + Date.now(),
      name,
      email,
      rollNo,
      phone,
      department,
      year,
      status,
      admissionDate
    };
    students.push(newStudent);
    showToast("New student registered successfully.");
  }

  saveState();
  closeStudentModal();
  renderAll();
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student and all associated enrollment records?")) {
    students = students.filter(s => s.id !== id);
    enrollments = enrollments.filter(e => e.studentId !== id);
    saveState();
    showToast("Student record removed.");
    renderAll();
  }
}

// Enrollments View
function renderEnrollmentsView() {
  // Populate dropdowns
  const stSelect = document.getElementById("enrollStudentSelect");
  stSelect.innerHTML = `<option value="">-- Choose Student --</option>`;
  students.forEach(s => {
    stSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo}) - ${s.department}</option>`;
  });

  const crSelect = document.getElementById("enrollCourseSelect");
  crSelect.innerHTML = `<option value="">-- Choose Course --</option>`;
  courses.forEach(c => {
    crSelect.innerHTML += `<option value="${c.id}">${c.code}: ${c.title} (${c.credits} Cr)</option>`;
  });

  // Course Catalog display
  const catalog = document.getElementById("courseCatalogList");
  catalog.innerHTML = "";
  courses.forEach(c => {
    const enrCount = enrollments.filter(e => e.courseId === c.id).length;
    catalog.innerHTML += `
      <div class="course-item">
        <div>
          <strong>${c.code} - ${c.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${c.dept} | ${c.credits} Credits</div>
        </div>
        <span class="badge badge-active">${enrCount} Enrolled</span>
      </div>
    `;
  });

  // Enrollments Table
  const table = document.getElementById("enrollmentsTable");
  document.getElementById("enrollmentCountBadge").textContent = `${enrollments.length} records`;
  table.innerHTML = "";

  if (enrollments.length === 0) {
    table.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">No course enrollments found.</td></tr>`;
    return;
  }

  enrollments.forEach(en => {
    const student = students.find(s => s.id === en.studentId) || { name: "Unknown", rollNo: "N/A" };
    const course = courses.find(c => c.id === en.courseId) || { code: "N/A", title: "N/A", credits: 0 };
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${en.id}</strong></td>
      <td>${student.name} <small class="text-muted">(${student.rollNo})</small></td>
      <td><strong>${course.code}</strong>: ${course.title}</td>
      <td>${course.credits}</td>
      <td>${en.semester}</td>
      <td><strong>${en.grade || "In Progress"}</strong></td>
      <td><span class="badge ${en.grade ? 'badge-active' : 'badge-probation'}">${en.status || 'Enrolled'}</span></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteEnrollment('${en.id}')">Unenroll</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

function handleEnrollStudent(event) {
  event.preventDefault();
  const studentId = document.getElementById("enrollStudentSelect").value;
  const courseId = document.getElementById("enrollCourseSelect").value;
  const semester = document.getElementById("enrollSemester").value;

  // Duplicate check
  const existing = enrollments.find(e => e.studentId === studentId && e.courseId === courseId && e.semester === semester);
  if (existing) {
    showToast("Student is already enrolled in this course for " + semester);
    return;
  }

  enrollments.push({
    id: "en-" + Date.now().toString().slice(-5),
    studentId,
    courseId,
    semester,
    grade: "A",
    attendance: 90,
    status: "Completed"
  });

  saveState();
  showToast("Student successfully enrolled!");
  renderAll();
}

function deleteEnrollment(id) {
  if (confirm("Remove this enrollment record?")) {
    enrollments = enrollments.filter(e => e.id !== id);
    saveState();
    showToast("Enrollment removed.");
    renderAll();
  }
}

// Grades & Progress View
function renderGradesView() {
  const select = document.getElementById("gradeEnrollmentSelect");
  select.innerHTML = `<option value="">-- Choose Student & Course Record --</option>`;
  enrollments.forEach(en => {
    const st = students.find(s => s.id === en.studentId);
    const cr = courses.find(c => c.id === en.courseId);
    if (st && cr) {
      select.innerHTML += `<option value="${en.id}">${st.name} - ${cr.code} (${en.semester}) [Current: ${en.grade || 'None'}]</option>`;
    }
  });

  // Academic Standing Table
  const table = document.getElementById("academicStandingTable");
  table.innerHTML = "";

  students.forEach(s => {
    const stEnrollments = enrollments.filter(e => e.studentId === s.id);
    let totalCredits = 0;
    stEnrollments.forEach(en => {
      const cr = courses.find(c => c.id === en.courseId);
      if (cr) totalCredits += cr.credits;
    });

    const gpa = calculateStudentGPA(s.id);
    const attendance = getStudentAttendance(s.id);

    let standing = "Good Standing";
    let badgeClass = "badge-active";
    if (parseFloat(gpa) >= 3.7) {
      standing = "Dean's High Honors";
    } else if (parseFloat(gpa) < 2.0) {
      standing = "Academic Probation";
      badgeClass = "badge-probation";
    }

    const pct = Math.min(100, Math.round((parseFloat(gpa) / 4.0) * 100));

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong>${s.name}</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">${s.rollNo} &bull; ${s.department}</div>
      </td>
      <td>${totalCredits} Credits</td>
      <td>${stEnrollments.length} Courses</td>
      <td><strong>${gpa}</strong> / 4.00</td>
      <td><span class="badge ${badgeClass}">${standing}</span></td>
      <td>${attendance}%</td>
      <td style="width: 140px;">
        <div class="dist-bar-bg" style="height:8px;">
          <div class="dist-bar-fill" style="width: ${pct}%; background: ${parseFloat(gpa) >= 3.0 ? 'var(--success)' : 'var(--warning)'};"></div>
        </div>
      </td>
    `;
    table.appendChild(tr);
  });
}

function handleRecordGrade(event) {
  event.preventDefault();
  const enrollmentId = document.getElementById("gradeEnrollmentSelect").value;
  const grade = document.getElementById("gradeLetterSelect").value;
  const attendance = Number(document.getElementById("gradeAttendance").value);

  const en = enrollments.find(e => e.id === enrollmentId);
  if (en) {
    en.grade = grade;
    en.attendance = attendance;
    en.status = "Completed";
    saveState();
    showToast("Grade updated and academic progress recalculated!");
    renderAll();
  }
}

// Reports & Transcripts
function renderReportsView() {
  const sel = document.getElementById("reportStudentSelect");
  const currentVal = sel.value;
  sel.innerHTML = "";
  students.forEach(s => {
    sel.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo}) - ${s.department}</option>`;
  });

  if (currentVal && students.find(s => s.id === currentVal)) {
    sel.value = currentVal;
  }

  renderStudentReport();
}

function viewStudentReport(studentId) {
  switchTab("reports");
  const sel = document.getElementById("reportStudentSelect");
  sel.value = studentId;
  renderStudentReport();
}

function renderStudentReport() {
  const sel = document.getElementById("reportStudentSelect");
  const studentId = sel.value;
  const s = students.find(item => item.id === studentId);
  if (!s) return;

  document.getElementById("reportDateStamp").innerHTML = `
    <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
    <strong>Document Ref:</strong> TRANS-${s.rollNo}
  `;

  const bio = document.getElementById("reportStudentDetails");
  bio.innerHTML = `
    <div class="report-bio-item">
      <strong>Student Name</strong>
      <span>${s.name}</span>
    </div>
    <div class="report-bio-item">
      <strong>Roll / Reg No</strong>
      <span>${s.rollNo}</span>
    </div>
    <div class="report-bio-item">
      <strong>Department</strong>
      <span>${s.department}</span>
    </div>
    <div class="report-bio-item">
      <strong>Academic Year</strong>
      <span>${s.year}</span>
    </div>
    <div class="report-bio-item">
      <strong>Email</strong>
      <span>${s.email}</span>
    </div>
    <div class="report-bio-item">
      <strong>Phone</strong>
      <span>${s.phone || 'N/A'}</span>
    </div>
    <div class="report-bio-item">
      <strong>Academic Status</strong>
      <span>${s.status}</span>
    </div>
    <div class="report-bio-item">
      <strong>Admission Date</strong>
      <span>${s.admissionDate || 'N/A'}</span>
    </div>
  `;

  const stEnrollments = enrollments.filter(e => e.studentId === s.id);
  const tbody = document.getElementById("reportCourseworkBody");
  tbody.innerHTML = "";

  let totalCredits = 0;
  let totalGradePoints = 0;

  stEnrollments.forEach(en => {
    const course = courses.find(c => c.id === en.courseId) || { code: "N/A", title: "Course", credits: 3 };
    const points = GRADE_POINTS[en.grade] !== undefined ? (GRADE_POINTS[en.grade] * course.credits).toFixed(1) : "0.0";
    if (GRADE_POINTS[en.grade] !== undefined) {
      totalCredits += course.credits;
      totalGradePoints += GRADE_POINTS[en.grade] * course.credits;
    }

    tbody.innerHTML += `
      <tr>
        <td><strong>${course.code}</strong></td>
        <td>${course.title}</td>
        <td>${course.credits}</td>
        <td>${en.semester}</td>
        <td><strong>${en.grade || "IP"}</strong></td>
        <td>${points}</td>
        <td>${en.status || 'Completed'}</td>
      </tr>
    `;
  });

  const finalGPA = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";
  const summaryBox = document.getElementById("reportSummaryBox");
  summaryBox.innerHTML = `
    <div>
      <span>Cumulative Credits Earned: </span> <strong>${totalCredits}</strong>
    </div>
    <div>
      <span>Total Quality Points: </span> <strong>${totalGradePoints.toFixed(1)}</strong>
    </div>
    <div>
      <span>Official Cumulative GPA: </span> <strong style="font-size: 1.1rem; color: var(--primary);">${finalGPA} / 4.00</strong>
    </div>
  `;
}

function printReport() {
  window.print();
}

function exportDataJSON() {
  const data = {
    students,
    courses,
    enrollments,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `edutrack-database-${Date.now()}.json`;
  a.click();
  showToast("Database exported as JSON.");
}

function exportCSV() {
  let csv = "Roll No,Name,Email,Department,Year,Status,CGPA,Enrolled Courses\n";
  students.forEach(s => {
    const gpa = calculateStudentGPA(s.id);
    const count = enrollments.filter(e => e.studentId === s.id).length;
    csv += `"${s.rollNo}","${s.name}","${s.email}","${s.department}","${s.year}","${s.status}",${gpa},${count}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `edutrack-students-${Date.now()}.csv`;
  a.click();
  showToast("Student directory exported as CSV.");
}

// Master Render
function renderAll() {
  renderDashboard();
  renderStudentsTable();
  renderEnrollmentsView();
  renderGradesView();
  renderReportsView();
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  renderAll();

  // Search input listener
  document.getElementById("globalSearch").addEventListener("input", () => {
    renderStudentsTable();
  });
});
