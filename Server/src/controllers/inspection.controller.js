import { 
  createInspectionSchema, 
  updateInspectionSchema,
  fieldRegistrationSchema 
} from '../validations/inspection.validation.js';
import { 
  createInspectionDb, 
  updateInspectionDb,
  getInspectionsByInspector, 
  getInspectionWithDetails,
  upsertFieldRegistrationDb
} from '../models/inspection.model.js';
import cloudinary from '../config/cloudinary.js';

/**
 * 🧠 CREATE INSPECTION (SHELL)
 * POST /api/inspections
 */
export const createInspection = async (req, res) => {
  try {
    const validatedData = createInspectionSchema.parse(req.body);
    const inspectorId = req.user.id;

    // Normalization only if data actually exists (to support empty Draft Shells)
    const normalizedData = { ...validatedData };
    if (normalizedData.cropType) {
      normalizedData.cropType = normalizedData.cropType.charAt(0).toUpperCase() + normalizedData.cropType.slice(1).toLowerCase();
    }
    if (normalizedData.productionType) {
      normalizedData.productionType = normalizedData.productionType.toLowerCase().includes('non') ? 'Non-Hybrid' : 'Hybrid';
    }

    const inspectionId = await createInspectionDb(normalizedData, inspectorId);

    res.status(201).json({ message: 'Inspection shell created', inspectionId });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || error.issues?.[0]?.message || 'Validation error';
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * 🧠 UPDATE INSPECTION
 * PUT /api/inspections/:id
 */
export const updateInspection = async (req, res) => {
  try {
    const inspectionId = parseInt(req.params.id);
    if (isNaN(inspectionId)) return res.status(400).json({ error: 'Invalid ID format' });

    // 1. Verify Ownership
    const inspection = await getInspectionWithDetails(inspectionId);
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    if (inspection.inspectorId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // 2. Validate Update Payload
    const validatedData = updateInspectionSchema.parse(req.body);

    // 3. Normalize
    const normalizedData = {
      ...validatedData,
      cropType: validatedData.cropType.charAt(0).toUpperCase() + validatedData.cropType.slice(1).toLowerCase(),
      productionType: validatedData.productionType.toLowerCase().includes('non') ? 'Non-Hybrid' : 'Hybrid'
    };

    // 4. Update in Database
    await updateInspectionDb(inspectionId, normalizedData);

    res.status(200).json({ message: 'Inspection updated successfully' });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || error.issues?.[0]?.message || 'Validation error';
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * 🧠 GET MY INSPECTIONS
 * GET /api/inspections
 */
export const getMyInspections = async (req, res) => {
  try {
    const inspectorId = req.user.id;
    const inspections = await getInspectionsByInspector(inspectorId);
    
    res.status(200).json(inspections);
  } catch (error) {
    console.error('Fetch Inspections Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching inspections' });
  }
};

/**
 * 🧠 GET INSPECTION BY ID
 * GET /api/inspections/:id
 */
export const getInspectionById = async (req, res) => {
  try {
    const inspectionId = parseInt(req.params.id);
    if (isNaN(inspectionId)) {
      return res.status(400).json({ error: 'Invalid inspection ID format' });
    }

    const inspection = await getInspectionWithDetails(inspectionId);

    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    // Security Check: Only the assigned inspector should view this
    if (inspection.inspectorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this inspection' });
    }

    res.status(200).json(inspection);
  } catch (error) {
    console.error('Fetch Single Inspection Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 🧠 SAVE FIELD REGISTRATION
 * POST /api/inspections/:id/field
 */
export const saveFieldRegistration = async (req, res) => {
  try {
    const inspectionId = parseInt(req.params.id);
    if (isNaN(inspectionId)) {
      return res.status(400).json({ error: 'Invalid inspection ID format' });
    }

    // 1. Verify Ownership
    const inspection = await getInspectionWithDetails(inspectionId);
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    if (inspection.inspectorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // 2. Validate field data
    const validatedData = fieldRegistrationSchema.parse(req.body);

    // 3. Process Cloudinary Image Upload
    if (req.body.fieldImageUrl && req.body.fieldImageUrl.startsWith('data:image')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.body.fieldImageUrl, {
          folder: 'seed_inspections/fields'
        });
        validatedData.fieldImageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Failed:', uploadError);
        return res.status(500).json({ error: 'Failed to upload field image to Cloudinary' });
      }
    }
    
    // Remote original heavy Base64 payload from the database parameters
    delete validatedData.fieldImage;
    delete validatedData.imageFileName;

    // 4. Upsert data in database
    const savedField = await upsertFieldRegistrationDb(inspectionId, validatedData);

    res.status(200).json({ 
      message: 'Field registration saved successfully', 
      field: savedField 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || error.issues?.[0]?.message || 'Validation error';
      return res.status(400).json({ error: message });
    }
    console.error('Save Field Registration Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
