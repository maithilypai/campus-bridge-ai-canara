import express from 'express';
import { protect } from './authRoutes.js';
import { authorizeAdmin } from '../middleware/adminMiddleware.js';
import { handlePdfUpload } from '../middleware/uploadMiddleware.js';
import {
  uploadResource,
  getAllResources,
  getResourceById,
  viewResourceFile,
  downloadResourceFile,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';

const router = express.Router();

// ── Public / Student & Admin Endpoints ─────────────────────────────────────
// Any authenticated or guest user can query and access academic resources
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.get('/:id/view', viewResourceFile);
router.get('/:id/download', downloadResourceFile);

// ── Administrative Endpoints (Admin Only) ──────────────────────────────────
// Protected by JWT verification AND admin authorization
router.post('/', protect, authorizeAdmin, handlePdfUpload, uploadResource);
router.put('/:id', protect, authorizeAdmin, handlePdfUpload, updateResource);
router.delete('/:id', protect, authorizeAdmin, deleteResource);

export default router;
