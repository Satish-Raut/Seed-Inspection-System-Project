import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { 
  createInspection, 
  updateInspection,
  getMyInspections, 
  getInspectionById, 
  saveFieldRegistration 
} from '../controllers/inspection.controller.js';
import { 
  submitStageData, 
  updateStageData 
} from '../controllers/stage.controller.js';

const router = express.Router();

// 🔒 All inspection routes are protected
router.use(verifyToken);

// ── INSPECTION LIFECYCLE ──
router.post('/', createInspection);
router.put('/:id', updateInspection);
router.get('/', getMyInspections);
router.get('/:id', getInspectionById);

// ── FIELD REGISTRATION ──
router.post('/:id/field', saveFieldRegistration);

// ── STAGE DATA ──
router.post('/:id/stages', submitStageData);
router.patch('/:id/stages/:stageId', updateStageData);

export default router;
