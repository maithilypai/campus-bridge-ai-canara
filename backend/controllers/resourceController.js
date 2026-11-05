import fs from 'fs';
import path from 'path';
import Resource from '../models/Resource.js';
import { UPLOAD_DIR } from '../middleware/uploadMiddleware.js';

// ── Helper: Safe File Deletion ──────────────────────────────────────────────
const safeUnlink = async (filename) => {
  if (!filename) return;
  try {
    const fullPath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (err) {
    console.error(`\x1b[33m[File Deletion Warning]\x1b[0m Could not delete ${filename}:`, err.message);
  }
};

// ── POST /api/resources (Admin Upload) ──────────────────────────────────────
/**
 * Upload an academic PDF resource.
 * Admin authorization verified by middleware.
 */
export const uploadResource = async (req, res) => {
  try {
    // 1. Verify file was provided by multer
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please attach an academic PDF document (.pdf).',
      });
    }

    const {
      title,
      description = '',
      academicYear,
      semester,
      department = 'Artificial Intelligence & Machine Learning',
      subjectName,
      subjectCode,
      category,
    } = req.body;

    // 2. Validate required metadata
    const missing = [];
    if (!title?.trim()) missing.push('title');
    if (!academicYear?.trim()) missing.push('academicYear');
    if (!semester) missing.push('semester');
    if (!subjectName?.trim()) missing.push('subjectName');
    if (!subjectCode?.trim()) missing.push('subjectCode');
    if (!category?.trim()) missing.push('category');

    if (missing.length > 0) {
      // Clean up uploaded file if metadata validation fails
      await safeUnlink(req.file.filename);
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    // 3. Create document in MongoDB Atlas
    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      academicYear: academicYear.trim(),
      semester: Number(semester),
      department: department.trim(),
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.trim().toUpperCase(),
      category: category.trim().toLowerCase(),
      storedFilename: req.file.filename,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype || 'application/pdf',
      uploadedBy: req.student.id,
      isPublished: true,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Academic resource published successfully.',
      data: { resource },
    });
  } catch (error) {
    // Clean up file if database write failed
    if (req.file?.filename) {
      await safeUnlink(req.file.filename);
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed.',
        errors: messages,
      });
    }

    console.error('\x1b[31m[Resource Controller - Upload Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to upload academic resource due to an internal server error.',
    });
  }
};

// ── GET /api/resources (List / Filter Resources) ────────────────────────────
/**
 * Retrieve academic resources with flexible query filtering.
 * Open to students and administrators.
 */
export const getAllResources = async (req, res) => {
  try {
    const {
      year,
      academicYear,
      semester,
      category,
      subjectCode,
      department,
      search,
    } = req.query;

    const query = { isPublished: true };

    if (academicYear && academicYear !== 'all') {
      query.academicYear = academicYear;
    }

    // Year shorthand filter (1, 2, 3, 4)
    if (year && year !== 'all') {
      const yearNum = Number(year);
      if (!isNaN(yearNum)) {
        // Match either "1st Year" or semester range
        const sems = [yearNum * 2 - 1, yearNum * 2];
        query.semester = { $in: sems };
      }
    }

    if (semester && semester !== 'all') {
      query.semester = Number(semester);
    }

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    if (subjectCode && subjectCode !== 'all') {
      query.subjectCode = subjectCode.toUpperCase();
    }

    if (department && department !== 'all') {
      query.department = new RegExp(department, 'i');
    }

    // Keyword search over title, subjectName, subjectCode
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { subjectName: { $regex: term, $options: 'i' } },
        { subjectCode: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'fullName collegeEmail')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      results: resources.length,
      data: { resources },
    });
  } catch (error) {
    console.error('\x1b[31m[Resource Controller - GetAll Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve academic resources.',
    });
  }
};

// ── GET /api/resources/:id (Get Single Resource) ───────────────────────────
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'fullName collegeEmail');

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Academic resource not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { resource },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error fetching resource.',
    });
  }
};

// ── GET /api/resources/:id/view (Inline PDF Stream) ────────────────────────
/**
 * Streams the PDF directly for browser previewing in an iframe or tab.
 */
export const viewResourceFile = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Academic resource not found.',
      });
    }

    const filePath = path.join(UPLOAD_DIR, resource.storedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'PDF file is not present on storage disk.',
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(resource.originalFilename)}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (error) {
    console.error('\x1b[31m[Resource Controller - View Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not stream PDF file.',
    });
  }
};

// ── GET /api/resources/:id/download (Attachment Download) ──────────────────
/**
 * Forces browser attachment download with proper Content-Disposition.
 */
export const downloadResourceFile = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Academic resource not found.',
      });
    }

    const filePath = path.join(UPLOAD_DIR, resource.storedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'PDF file is not present on storage disk.',
      });
    }

    return res.download(filePath, resource.originalFilename, (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({
          status: 'error',
          message: 'Error downloading file.',
        });
      }
    });
  } catch (error) {
    console.error('\x1b[31m[Resource Controller - Download Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not download PDF file.',
    });
  }
};

// ── PUT /api/resources/:id (Admin Edit) ────────────────────────────────────
/**
 * Update resource metadata. Optionally replace attached PDF file.
 */
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      if (req.file?.filename) await safeUnlink(req.file.filename);
      return res.status(404).json({
        status: 'error',
        message: 'Academic resource not found.',
      });
    }

    const {
      title,
      description,
      academicYear,
      semester,
      department,
      subjectName,
      subjectCode,
      category,
      isPublished,
    } = req.body;

    if (title !== undefined) resource.title = title.trim();
    if (description !== undefined) resource.description = description.trim();
    if (academicYear !== undefined) resource.academicYear = academicYear.trim();
    if (semester !== undefined) resource.semester = Number(semester);
    if (department !== undefined) resource.department = department.trim();
    if (subjectName !== undefined) resource.subjectName = subjectName.trim();
    if (subjectCode !== undefined) resource.subjectCode = subjectCode.trim().toUpperCase();
    if (category !== undefined) resource.category = category.trim().toLowerCase();
    if (isPublished !== undefined) resource.isPublished = Boolean(isPublished);

    // If new file attached, delete previous disk file and update metadata
    if (req.file) {
      const oldFilename = resource.storedFilename;
      resource.storedFilename = req.file.filename;
      resource.originalFilename = req.file.originalname;
      resource.fileSize = req.file.size;
      resource.mimeType = req.file.mimetype || 'application/pdf';
      await safeUnlink(oldFilename);
    }

    await resource.save();

    return res.status(200).json({
      status: 'success',
      message: 'Resource updated successfully.',
      data: { resource },
    });
  } catch (error) {
    if (req.file?.filename) await safeUnlink(req.file.filename);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed.',
        errors: messages,
      });
    }

    console.error('\x1b[31m[Resource Controller - Update Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update academic resource.',
    });
  }
};

// ── DELETE /api/resources/:id (Admin Delete) ───────────────────────────────
/**
 * Permanently removes resource document from MongoDB Atlas AND
 * unlinks the physical PDF file from the server storage disk.
 */
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Academic resource not found.',
      });
    }

    const storedFilename = resource.storedFilename;

    // Delete document from MongoDB
    await Resource.deleteOne({ _id: resource._id });

    // Safely delete PDF file from storage disk
    await safeUnlink(storedFilename);

    return res.status(200).json({
      status: 'success',
      message: 'Academic resource and attached PDF file deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('\x1b[31m[Resource Controller - Delete Error]\x1b[0m', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete academic resource.',
    });
  }
};
