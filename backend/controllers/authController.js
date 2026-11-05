import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Generate a signed JWT for the given student.
 * Token expires in 7 days (configurable via JWT_EXPIRES_IN env var).
 *
 * @param {string} id - Student document _id
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Build a consistent success response payload including the JWT and
 * a sanitised student object (no password, no __v).
 */
const authResponse = (res, statusCode, student) => {
  const token = generateToken(student._id);

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        USN: student.USN,
        collegeEmail: student.collegeEmail,
        department: student.department,
        academicYear: student.academicYear,
        semester: student.semester,
        role: student.role || 'student',
        createdAt: student.createdAt,
      },
    },
  });
};

// ── POST /api/auth/register ───────────────────────────────────────────────

/**
 * Register a new student.
 *
 * Body (all required):
 *   fullName, USN, collegeEmail, department, academicYear, semester, password, confirmPassword
 *
 * Validations performed here (beyond Mongoose schema validations):
 *   - All required fields must be present
 *   - password must match confirmPassword
 *   - Duplicate USN or email → user-friendly 409 Conflict
 */
export const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      USN,
      collegeEmail,
      department,
      academicYear,
      semester,
      password,
      confirmPassword,
    } = req.body;

    // ── 1. Presence check ─────────────────────────────────────────────────
    const requiredFields = {
      fullName,
      USN,
      collegeEmail,
      department,
      academicYear,
      semester,
      password,
      confirmPassword,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => value === undefined || value === null || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required.',
        missingFields,
      });
    }

    // ── 2. Password confirmation ──────────────────────────────────────────
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match. Please re-enter and try again.',
      });
    }

    // ── 3. Minimum password strength ─────────────────────────────────────
    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long.',
      });
    }

    // ── 4. Duplicate check (early, before bcrypt) ─────────────────────────
    const normalisedUSN = USN.trim().toUpperCase();
    const normalisedEmail = collegeEmail.trim().toLowerCase();

    const existing = await Student.findOne({
      $or: [{ USN: normalisedUSN }, { collegeEmail: normalisedEmail }],
    });

    if (existing) {
      const field = existing.USN === normalisedUSN ? 'USN' : 'college email';
      return res.status(409).json({
        status: 'error',
        message: `A student with this ${field} is already registered. Please log in instead.`,
      });
    }

    // ── 5. Create student (role is ALWAYS 'student'; password hashed in pre-save hook) ──
    const student = await Student.create({
      fullName: fullName.trim(),
      USN,          // schema normalises to uppercase
      collegeEmail, // schema normalises to lowercase
      department: department.trim(),
      academicYear: String(academicYear).trim(),
      semester: Number(semester),
      password,     // plain text — hashed in pre-save hook; NEVER logged
      role: 'student', // enforced: registration payloads can NEVER grant admin role
    });

    // ── 6. Respond with token ─────────────────────────────────────────────
    return authResponse(res, 201, student);
  } catch (error) {
    // Mongoose duplicate-key error (race condition fallback)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({
        status: 'error',
        message: `A student with this ${field} already exists.`,
      });
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed.',
        errors: messages,
      });
    }

    console.error('\x1b[31m[Auth - Register Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Registration failed due to an internal server error. Please try again.',
    });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────

/**
 * Login an existing student.
 *
 * Body (all required):
 *   identifier  — USN or college email (auto-detected)
 *   password    — plain-text password
 *
 * Security notes:
 *   - Generic "Invalid credentials" message prevents user enumeration.
 *   - Password field is explicitly re-selected here (select: false in schema).
 */
export const loginStudent = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // ── 1. Presence check ─────────────────────────────────────────────────
    if (!identifier || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide your USN or email and password.',
      });
    }

    // ── 2. Auto-detect USN vs email ───────────────────────────────────────
    const isEmail = identifier.includes('@');
    const query = isEmail
      ? { collegeEmail: identifier.trim().toLowerCase() }
      : { USN: identifier.trim().toUpperCase() };

    // ── 3. Fetch student WITH password (select: false override) ───────────
    const student = await Student.findOne(query).select('+password');

    if (!student) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials. Please check your USN/email and password.',
      });
    }

    // ── 4. Verify password ────────────────────────────────────────────────
    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials. Please check your USN/email and password.',
      });
    }

    // ── 5. Respond with token ─────────────────────────────────────────────
    return authResponse(res, 200, student);
  } catch (error) {
    console.error('\x1b[31m[Auth - Login Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed due to an internal server error. Please try again.',
    });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────

/**
 * Return the currently authenticated student's profile.
 * Requires the `protect` middleware to run first (injects req.student).
 */
export const getMe = async (req, res) => {
  try {
    // req.student is populated by the protect middleware
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student account not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        student: {
          id: student._id,
          fullName: student.fullName,
          USN: student.USN,
          collegeEmail: student.collegeEmail,
          department: student.department,
          academicYear: student.academicYear,
          semester: student.semester,
          role: student.role || 'student',
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('\x1b[31m[Auth - GetMe Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not retrieve profile. Please try again.',
    });
  }
};
