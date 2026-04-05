import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { 
  finalizeReport, 
  getAllReports, 
  submitReportToAuthority 
} from '../controllers/report.controller.js';

const router = express.Router();

// 🔒 All report routes are protected
router.use(verifyToken);

// ── FINAL REPORTS / CERTIFICATES ──
router.post('/', finalizeReport);
router.get('/', getAllReports);
router.post('/:id/submit', submitReportToAuthority);

export default router;
