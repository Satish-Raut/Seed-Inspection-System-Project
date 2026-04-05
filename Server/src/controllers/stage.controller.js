import { stageDataSchema } from '../validations/inspection.validation.js';
import { getInspectionWithDetails, insertStageDataDb, updateStageDataDb } from '../models/inspection.model.js';
import cloudinary from '../config/cloudinary.js';

/**
 * 🧠 SUBMIT STAGE DATA
 * POST /api/inspections/:id/stages
 */
export const submitStageData = async (req, res) => {
  try {
    const inspectionId = parseInt(req.params.id);
    if (isNaN(inspectionId)) return res.status(400).json({ error: 'Invalid inspection ID' });

    // 1. Verify Ownership
    const inspection = await getInspectionWithDetails(inspectionId);
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    if (inspection.inspectorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 2. Validate dynamic stage form
    const validatedData = stageDataSchema.parse(req.body);

    // ── 3. CLOUDINARY IMAGE PROCESSOR ──────────────────────────────────
    // If formData contains a base64 image (specifically tagImage or stageImage)
    const fd = validatedData.formData || {};
    
    // Look for image-like keys (this handles our Seed Tag or Stage evidence)
    const imageKeys = ['tagImage', 'stageImage', 'evidenceImage'];
    
    for (const key of imageKeys) {
      if (fd[key] && fd[key].startsWith('data:image')) {
        try {
          const uploadRes = await cloudinary.uploader.upload(fd[key], {
            folder: `seed_inspections/stages/stage_${validatedData.stageNumber}`
          });
          fd[key] = uploadRes.secure_url; // Replace Base64 with CDN URL
        } catch (err) {
          console.error(`Cloudinary Stage Image Upload [${key}] Failed:`, err);
          // We can choose to fail the request or continue with Base64 (failing is safer for DB size)
          return res.status(500).json({ error: 'Failed to upload stage image to Cloudinary' });
        }
      }
    }
    
    validatedData.formData = fd;

    // 4. Insert into DB
    const stageDataId = await insertStageDataDb(inspectionId, validatedData);

    res.status(201).json({ 
      message: 'Stage data submitted successfully', 
      stageId: stageDataId 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || error.issues?.[0]?.message || 'Validation error';
      return res.status(400).json({ error: message });
    }
    console.error('Submit Stage Data Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * 🧠 UPDATE STAGE DATA
 * PATCH /api/inspections/:id/stages/:stageId
 */
export const updateStageData = async (req, res) => {
  try {
    const inspectionId = parseInt(req.params.id);
    const stageId = parseInt(req.params.stageId);
    if (isNaN(inspectionId) || isNaN(stageId)) {
      return res.status(400).json({ error: 'Invalid ID parameters' });
    }

    // Verify Ownership
    const inspection = await getInspectionWithDetails(inspectionId);
    if (!inspection || inspection.inspectorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For partial update, we can parse partial data safely (stripping invalid fields)
    const partialData = stageDataSchema.partial().parse(req.body);

    await updateStageDataDb(stageId, partialData);

    res.status(200).json({ message: 'Stage data updated successfully' });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || error.issues?.[0]?.message || 'Validation error';
      return res.status(400).json({ error: message });
    }
    console.error('Update Stage Data Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
