import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import {
  registerStudent,
  loginStudent,
  getMe,
} from '../controllers/authController.js';

const router = express.Router();

// ── Protect Middleware ────────────────────────────────────────────────────

/**
 * protect
 * -------
 * Verifies the Bearer JWT in the Authorization header.
 * On success, injects `req.student = { id }` and calls next().
 * On failure, returns 401 immediately — never calls next(err) for auth
 * failures so they don't accidentally bubble to the global error handler
 * with a 500 status.
 *
 * Usage: add `protect` as a middleware before any route that requires auth.
 *   router.get('/profile', protect, getProfile);
 */
export const protect = async (req, res, next) => {
  try {
    // ── 1. Extract token ────────────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No authentication token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Malformed authorization header.',
      });
    }

    // ── 2. Verify token ─────────────────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      const isExpired = jwtErr.name === 'TokenExpiredError';
      return res.status(401).json({
        status: 'error',
        message: isExpired
          ? 'Your session has expired. Please log in again.'
          : 'Invalid token. Please log in again.',
      });
    }

    // ── 3. Confirm student still exists in DB & load role ───────────────
    const student = await Student.findById(decoded.id).select('_id role');

    if (!student) {
      return res.status(401).json({
        status: 'error',
        message: 'The account associated with this token no longer exists.',
      });
    }

    // ── 4. Attach student identity & role to request ─────────────────────
    req.student = {
      id: decoded.id,
      role: student.role || 'student',
    };
    next();
  } catch (error) {
    console.error('\x1b[31m[Auth - Protect Middleware Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication check failed. Please try again.',
    });
  }
};

// ── Public Routes (no token required) ────────────────────────────────────

/**
 * POST /api/auth/register
 * Register a new student account.
 *
 * Body: { fullName, USN, collegeEmail, department, academicYear, semester, password, confirmPassword }
 * Returns: { status, token, data: { student } }
 */
router.post('/register', registerStudent);

/**
 * POST /api/auth/login
 * Log in with USN or college email + password.
 *
 * Body: { identifier, password }
 *   identifier — USN (e.g. "1RV21CS042") OR college email
 * Returns: { status, token, data: { student } }
 */
router.post('/login', loginStudent);

// ── Protected Routes (valid JWT required) ────────────────────────────────

/**
 * GET /api/auth/me
 * Return the currently authenticated student's profile.
 * Header: Authorization: Bearer <token>
 */
router.get('/me', protect, getMe);

export default router;
