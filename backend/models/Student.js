import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Student Schema
 * -------------
 * Represents a registered student in the Campus Bridge AI system.
 *
 * Security rules enforced at the schema level:
 *  - USN and collegeEmail are stored in normalised form (uppercase USN,
 *    lowercase email) so lookups are case-insensitive by convention.
 *  - Passwords are NEVER stored in plain text; bcrypt hashing is applied
 *    automatically in a pre-save hook.
 *  - The password field is excluded from JSON serialisation by default
 *    (select: false), so it never leaks into API responses accidentally.
 */
const studentSchema = new mongoose.Schema(
  {
    // ── Personal / Academic Identity ─────────────────────────────────────
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name must not exceed 100 characters'],
    },

    USN: {
      type: String,
      required: [true, 'USN is required'],
      unique: true,
      trim: true,
      uppercase: true, // normalise on write
      match: [
        /^[A-Z0-9]+$/i,
        'USN must contain only alphanumeric characters',
      ],
    },

    collegeEmail: {
      type: String,
      required: [true, 'College email is required'],
      unique: true,
      trim: true,
      lowercase: true, // normalise on write
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },

    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },

    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },

    // ── Credentials & Role ───────────────────────────────────────────────
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never return password in query results by default
    },

    role: {
      type: String,
      enum: {
        values: ['student', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'student',
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────
// unique: true already creates indexes for USN and collegeEmail;
// adding an extra text index on fullName for future search features.
studentSchema.index({ fullName: 'text' });

// ── Pre-save Hook: Hash password ──────────────────────────────────────────
/**
 * Only re-hash when the password field is actually modified.
 * This prevents double-hashing on unrelated document saves.
 */
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 12; // recommended minimum; adjust upward for extra security
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// ── Instance Method: Compare Passwords ───────────────────────────────────
/**
 * Safely compare a plain-text candidate against the stored hash.
 * Never compare manually outside this method.
 *
 * @param {string} candidatePassword - Plain-text password from login form
 * @returns {Promise<boolean>}
 */
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── toJSON Transform: Strip sensitive fields from responses ───────────────
studentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
