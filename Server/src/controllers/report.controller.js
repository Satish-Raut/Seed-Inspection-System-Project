import { reportSchema } from '../validations/inspection.validation.js';
import { getInspectionWithDetails, createReportDb, getAllReportsDb } from '../models/inspection.model.js';
import { db } from '../db/index.js';
import { inspections } from '../models/schema.js';
import { eq } from 'drizzle-orm';

/**
 * 🧠 FINALIZE REPORT
 * POST /api/reports
 */
export const finalizeReport = async (req, res) => {
  try {
    const { inspectionId, ...reportData } = req.body;
    if (!inspectionId) return res.status(400).json({ error: 'Inspection ID is required' });

    // 1. Verify Ownership & Existence
    const inspection = await getInspectionWithDetails(inspectionId);
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    if (inspection.inspectorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 2. Validate report verdict
    const validatedData = reportSchema.parse(reportData);

    // 3. Issue the report in DB
    const reportId = await createReportDb({
      inspectionId,
      ...validatedData
    });

    // 4. Update the main inspection status based on the verdict
    let newStatus = 'Completed';
    if (validatedData.verdict === 'Rejected') newStatus = 'Rejected';
    
    await db.update(inspections)
      .set({ status: newStatus })
      .where(eq(inspections.id, inspectionId));

    res.status(201).json({ 
      message: 'Report finalized and certificate issued successfully', 
      reportId 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Finalize Report Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 🧠 GET ALL REPORTS / CERTIFICATES
 * GET /api/reports
 */
export const getAllReports = async (req, res) => {
  try {
    const reportsList = await getAllReportsDb();
    
    // An Inspector might only be allowed to see their own reports. 
    // If it's a field inspector role, filter it down.
    const myReports = req.user.role === 'admin' 
        ? reportsList 
        : reportsList.filter(r => r.inspection.inspectorId === req.user.id);

    res.status(200).json(myReports);
  } catch (error) {
    console.error('Fetch Reports Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 🧠 SUBMIT REPORT TO AUTHORITY (Mock Email/Push)
 * POST /api/reports/:id/submit
 */
export const submitReportToAuthority = async (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    if (isNaN(reportId)) return res.status(400).json({ error: 'Invalid report ID' });

    // Mock logic for sending email to agricultural authority
    console.log(`📡 [MOCK] Sending certificate Report #${reportId} to Authority...`);
    
    res.status(200).json({ message: 'Certificate successfully submitted to the authority.' });
  } catch (error) {
    console.error('Submit Authority Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
