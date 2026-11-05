import Student from '../models/Student.js';

/**
 * authorizeAdmin
 * --------------
 * Middleware to restrict route access strictly to users with role === 'admin'.
 * Must be executed AFTER the `protect` middleware.
 *
 * Verifies role from `req.student.role`, with a database fallback check to
 * ensure role freshness and security.
 */
export const authorizeAdmin = async (req, res, next) => {
  try {
    if (!req.student || !req.student.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required before verifying administrative privileges.',
      });
    }

    let role = req.student.role;

    // Fallback: If role was not populated in req.student, query DB directly
    if (!role) {
      const student = await Student.findById(req.student.id).select('role');
      if (!student) {
        return res.status(401).json({
          status: 'error',
          message: 'User account not found.',
        });
      }
      role = student.role;
      req.student.role = role;
    }

    if (role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Administrator privileges are required to perform this action.',
      });
    }

    next();
  } catch (error) {
    console.error('\x1b[31m[Admin Middleware Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authorization check failed due to an internal server error.',
    });
  }
};
