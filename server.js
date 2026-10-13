import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database(':memory:');

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      dateOfBirth TEXT,
      address TEXT,
      parentName TEXT,
      parentEmail TEXT,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'active'
    )
  `);

  db.run(`
    CREATE TABLE enrollments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      grade TEXT,
      FOREIGN KEY (studentId) REFERENCES students(id)
    )
  `);

  db.run(`
    CREATE TABLE courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      instructor TEXT,
      credits INTEGER,
      description TEXT,
      maxStudents INTEGER,
      semester TEXT
    )
  `);

  db.run(`
    CREATE TABLE academicProgress (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      semester TEXT NOT NULL,
      gpa REAL,
      totalCredits INTEGER,
      coursesCompleted INTEGER,
      status TEXT,
      FOREIGN KEY (studentId) REFERENCES students(id)
    )
  `);

  db.run(`
    CREATE TABLE grades (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      assignment TEXT,
      score REAL,
      maxScore REAL,
      weight REAL,
      recordedDate TEXT,
      FOREIGN KEY (studentId) REFERENCES students(id),
      FOREIGN KEY (courseId) REFERENCES courses(id)
    )
  `);

  console.log('Database tables created successfully');
});

// ============ STUDENT ENDPOINTS ============

// Register a new student
app.post('/api/students', (req, res) => {
  const { name, email, phone, dateOfBirth, address, parentName, parentEmail } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const id = uuidv4();
  const enrollmentDate = new Date().toISOString().split('T')[0];

  db.run(
    `INSERT INTO students (id, name, email, phone, dateOfBirth, address, parentName, parentEmail, enrollmentDate, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, dateOfBirth, address, parentName, parentEmail, enrollmentDate, 'active'],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Email already exists or invalid data' });
      }
      res.status(201).json({
        id,
        name,
        email,
        phone,
        dateOfBirth,
        address,
        parentName,
        parentEmail,
        enrollmentDate,
        status: 'active',
      });
    }
  );
});

// Get all students
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY enrollmentDate DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single student
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// Update student
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, address, parentName, parentEmail, status } = req.body;

  db.run(
    'UPDATE students SET name = ?, phone = ?, address = ?, parentName = ?, parentEmail = ?, status = ? WHERE id = ?',
    [name, phone, address, parentName, parentEmail, status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted successfully' });
  });
});

// ============ COURSE ENDPOINTS ============

// Create a course
app.post('/api/courses', (req, res) => {
  const { name, code, instructor, credits, description, maxStudents, semester } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO courses (id, name, code, instructor, credits, description, maxStudents, semester)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, code, instructor, credits, description, maxStudents, semester],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Course code must be unique' });
      }
      res.status(201).json({
        id,
        name,
        code,
        instructor,
        credits,
        description,
        maxStudents,
        semester,
      });
    }
  );
});

// Get all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses ORDER BY semester DESC, name ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ============ ENROLLMENT ENDPOINTS ============

// Enroll student in course
app.post('/api/enrollments', (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({ error: 'studentId and courseId are required' });
  }

  const id = uuidv4();
  const enrollmentDate = new Date().toISOString().split('T')[0];

  db.run(
    `INSERT INTO enrollments (id, studentId, courseId, enrollmentDate, status)
     VALUES (?, ?, ?, ?, ?)`,
    [id, studentId, courseId, enrollmentDate, 'active'],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Invalid student or course ID' });
      }
      res.status(201).json({
        id,
        studentId,
        courseId,
        enrollmentDate,
        status: 'active',
      });
    }
  );
});

// Get enrollments for a student
app.get('/api/students/:studentId/enrollments', (req, res) => {
  const { studentId } = req.params;

  db.all(
    `SELECT e.*, c.name as courseName, c.code as courseCode, c.credits
     FROM enrollments e
     JOIN courses c ON e.courseId = c.id
     WHERE e.studentId = ?`,
    [studentId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Update enrollment (status, grade)
app.put('/api/enrollments/:id', (req, res) => {
  const { id } = req.params;
  const { status, grade } = req.body;

  db.run(
    'UPDATE enrollments SET status = ?, grade = ? WHERE id = ?',
    [status, grade, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Enrollment updated successfully' });
    }
  );
});

// ============ GRADES ENDPOINTS ============

// Record grade
app.post('/api/grades', (req, res) => {
  const { studentId, courseId, assignment, score, maxScore, weight } = req.body;

  if (!studentId || !courseId || score === undefined) {
    return res.status(400).json({ error: 'studentId, courseId, and score are required' });
  }

  const id = uuidv4();
  const recordedDate = new Date().toISOString();

  db.run(
    `INSERT INTO grades (id, studentId, courseId, assignment, score, maxScore, weight, recordedDate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, studentId, courseId, assignment, score, maxScore, weight, recordedDate],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      res.status(201).json({
        id,
        studentId,
        courseId,
        assignment,
        score,
        maxScore,
        weight,
        recordedDate,
      });
    }
  );
});

// Get grades for student
app.get('/api/students/:studentId/grades', (req, res) => {
  const { studentId } = req.params;

  db.all(
    `SELECT g.*, c.name as courseName, c.code as courseCode
     FROM grades g
     JOIN courses c ON g.courseId = c.id
     WHERE g.studentId = ?
     ORDER BY g.recordedDate DESC`,
    [studentId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ============ ACADEMIC PROGRESS ENDPOINTS ============

// Calculate and save academic progress
app.post('/api/academic-progress', (req, res) => {
  const { studentId, semester } = req.body;

  if (!studentId || !semester) {
    return res.status(400).json({ error: 'studentId and semester are required' });
  }

  // Calculate GPA and progress metrics
  db.all(
    `SELECT g.score, g.maxScore, g.weight, e.id as enrollmentId
     FROM grades g
     JOIN enrollments e ON g.studentId = e.studentId AND g.courseId = e.courseId
     WHERE g.studentId = ?`,
    [studentId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      let totalWeightedScore = 0;
      let totalWeight = 0;
      const enrollmentCount = new Set();

      rows.forEach((row) => {
        const percentage = (row.score / row.maxScore) * 100;
        const weight = row.weight || 1;
        totalWeightedScore += percentage * weight;
        totalWeight += weight;
        enrollmentCount.add(row.enrollmentId);
      });

      const gpa = totalWeight > 0 ? parseFloat((totalWeightedScore / totalWeight / 20).toFixed(2)) : 0;
      const coursesCompleted = enrollmentCount.size;

      db.get(
        `SELECT SUM(credits) as totalCredits FROM enrollments e
         JOIN courses c ON e.courseId = c.id
         WHERE e.studentId = ? AND e.status = 'active'`,
        [studentId],
        (credErr, credRow) => {
          if (credErr) return res.status(500).json({ error: credErr.message });

          const totalCredits = credRow.totalCredits || 0;
          const status = gpa >= 3.5 ? 'Excellent' : gpa >= 3.0 ? 'Good' : gpa >= 2.5 ? 'Satisfactory' : 'Needs Improvement';

          const id = uuidv4();
          db.run(
            `INSERT INTO academicProgress (id, studentId, semester, gpa, totalCredits, coursesCompleted, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, studentId, semester, gpa, totalCredits, coursesCompleted, status],
            (progErr) => {
              if (progErr) return res.status(500).json({ error: progErr.message });
              res.status(201).json({
                id,
                studentId,
                semester,
                gpa,
                totalCredits,
                coursesCompleted,
                status,
              });
            }
          );
        }
      );
    }
  );
});

// Get academic progress for student
app.get('/api/students/:studentId/progress', (req, res) => {
  const { studentId } = req.params;

  db.all(
    'SELECT * FROM academicProgress WHERE studentId = ? ORDER BY semester DESC',
    [studentId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ============ REPORTS ENDPOINTS ============

// Generate student performance report
app.get('/api/reports/student/:studentId', (req, res) => {
  const { studentId } = req.params;

  db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, student) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    db.all(
      `SELECT e.*, c.name as courseName, c.code as courseCode, c.credits
       FROM enrollments e
       JOIN courses c ON e.courseId = c.id
       WHERE e.studentId = ?`,
      [studentId],
      (enrollErr, enrollments) => {
        if (enrollErr) return res.status(500).json({ error: enrollErr.message });

        db.all(
          `SELECT g.*, c.name as courseName
           FROM grades g
           JOIN courses c ON g.courseId = c.id
           WHERE g.studentId = ?
           ORDER BY c.name`,
          [studentId],
          (gradesErr, grades) => {
            if (gradesErr) return res.status(500).json({ error: gradesErr.message });

            db.all(
              'SELECT * FROM academicProgress WHERE studentId = ? ORDER BY semester DESC',
              [studentId],
              (progErr, progress) => {
                if (progErr) return res.status(500).json({ error: progErr.message });

                const report = {
                  student,
                  enrollments,
                  grades,
                  progressHistory: progress,
                  currentSemester: progress[0] || null,
                  generatedDate: new Date().toISOString(),
                };

                res.json(report);
              }
            );
          }
        );
      }
    );
  });
});

// Generate class performance report
app.get('/api/reports/class/:courseId', (req, res) => {
  const { courseId } = req.params;

  db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    db.all(
      `SELECT e.*, s.name as studentName, s.email
       FROM enrollments e
       JOIN students s ON e.studentId = s.id
       WHERE e.courseId = ?
       ORDER BY s.name`,
      [courseId],
      (enrollErr, enrollments) => {
        if (enrollErr) return res.status(500).json({ error: enrollErr.message });

        const classReport = {
          course,
          studentCount: enrollments.length,
          enrollments,
          generatedDate: new Date().toISOString(),
        };

        res.json(classReport);
      }
    );
  });
});

// Generate institutional report
app.get('/api/reports/institutional', (req, res) => {
  db.all('SELECT COUNT(*) as totalStudents FROM students', (err, studentCount) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all('SELECT COUNT(*) as totalCourses FROM courses', (courseErr, courseCount) => {
      if (courseErr) return res.status(500).json({ error: courseErr.message });

      db.all('SELECT COUNT(*) as totalEnrollments FROM enrollments', (enrollErr, enrollCount) => {
        if (enrollErr) return res.status(500).json({ error: enrollErr.message });

        db.all(
          'SELECT AVG(gpa) as avgGPA FROM academicProgress',
          (gpaErr, gpaData) => {
            if (gpaErr) return res.status(500).json({ error: gpaErr.message });

            const institutionalReport = {
              totalStudents: studentCount[0].totalStudents,
              totalCourses: courseCount[0].totalCourses,
              totalEnrollments: enrollCount[0].totalEnrollments,
              averageGPA: parseFloat((gpaData[0].avgGPA || 0).toFixed(2)),
              generatedDate: new Date().toISOString(),
              reportType: 'Institutional Overview',
            };

            res.json(institutionalReport);
          }
        );
      });
    });
  });
});

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`Student Management Dashboard API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST   /api/students - Register new student');
  console.log('  GET    /api/students - Get all students');
  console.log('  GET    /api/students/:id - Get student details');
  console.log('  PUT    /api/students/:id - Update student');
  console.log('  DELETE /api/students/:id - Delete student');
  console.log('  POST   /api/courses - Create course');
  console.log('  GET    /api/courses - Get all courses');
  console.log('  POST   /api/enrollments - Enroll student');
  console.log('  GET    /api/students/:studentId/enrollments - Get student enrollments');
  console.log('  POST   /api/grades - Record grade');
  console.log('  GET    /api/students/:studentId/grades - Get student grades');
  console.log('  POST   /api/academic-progress - Calculate progress');
  console.log('  GET    /api/students/:studentId/progress - Get progress history');
  console.log('  GET    /api/reports/student/:studentId - Student performance report');
  console.log('  GET    /api/reports/class/:courseId - Class performance report');
  console.log('  GET    /api/reports/institutional - Institutional report');
});

export default app;
