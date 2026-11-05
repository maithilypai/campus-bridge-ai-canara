import mongoose from 'mongoose';

/**
 * Resource Schema
 * ---------------
 * Represents an academic resource document (PDF) in the Canara Engineering College
 * Autonomous Academic Resource System.
 *
 * Binary file content is stored securely on the local file system
 * (outside MongoDB Atlas). Only document metadata, validation metrics,
 * and relative disk references are persisted here.
 */
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
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

    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Artificial Intelligence & Machine Learning',
    },

    subjectName: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },

    subjectCode: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      required: [true, 'Resource category is required'],
      enum: {
        values: ['notes', 'syllabus', 'question-papers', 'lab-manuals'],
        message: '{VALUE} is not a valid category. Valid options: notes, syllabus, question-papers, lab-manuals',
      },
    },

    // ── File storage metadata (PDF stored outside MongoDB) ─────────────────
    storedFilename: {
      type: String,
      required: [true, 'Stored filename is required'],
      trim: true,
    },

    originalFilename: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },

    fileSize: {
      type: Number,
      required: [true, 'File size in bytes is required'],
    },

    mimeType: {
      type: String,
      default: 'application/pdf',
      trim: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Uploader identity reference is required'],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance student searching and filtering
resourceSchema.index({ academicYear: 1, semester: 1, category: 1 });
resourceSchema.index({ subjectCode: 1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ title: 'text', subjectName: 'text', description: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
