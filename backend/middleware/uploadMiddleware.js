import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory: backend/uploads/resources/
export const UPLOAD_DIR = path.resolve(__dirname, '..', 'uploads', 'resources');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Multer Disk Storage Engine ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate secure, collision-free filename: resource-<timestamp>-<random-hex>.pdf
    const randomHex = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const sanitizedExt = path.extname(file.originalname).toLowerCase();
    cb(null, `resource-${timestamp}-${randomHex}${sanitizedExt || '.pdf'}`);
  },
});

// ── File Filter: Restrict strictly to PDF ───────────────────────────────────
const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdfMime && isPdfExt) {
    cb(null, true);
  } else {
    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    error.message = 'Only PDF documents (.pdf) are permitted for academic resources.';
    cb(error, false);
  }
};

// ── Multer Instance (35 MB file size limit for course books & guides) ───────
export const uploadResourceFile = multer({
  storage,
  limits: {
    fileSize: 35 * 1024 * 1024, // 35 Megabytes
    files: 1, // 1 file per upload
  },
  fileFilter,
});

/**
 * uploadResourceMiddleware
 * ------------------------
 * Express wrapper that catches multer errors (e.g. file size exceeded, invalid format)
 * and formats clean JSON responses instead of crashing.
 */
export const handlePdfUpload = (req, res, next) => {
  const upload = uploadResourceFile.single('file');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: 'File size exceeds the 35MB limit. Please upload a smaller PDF.',
        });
      }
      return res.status(400).json({
        status: 'error',
        message: err.message || 'File upload validation error.',
      });
    } else if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message || 'An error occurred during file upload.',
      });
    }
    next();
  });
};
