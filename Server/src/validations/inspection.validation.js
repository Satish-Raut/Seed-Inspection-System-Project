import { z } from 'zod';

/**
 * 🛡️ CREATE INSPECTION SCHEMA
 * Validates the initial creation of an inspection session.
 */
export const createInspectionSchema = z.object({
  cropType: z.string().optional(),
  productionType: z.string().optional(),
  totalStages: z.number().int().optional()
});

/**
 * 🛡️ UPDATE INSPECTION SCHEMA
 * Validates the addition of crop and production types mid-workflow.
 */
export const updateInspectionSchema = z.object({
  cropType: z.string().min(1, 'Crop type is required'),
  productionType: z.string().min(1, 'Production type is required'),
  totalStages: z.number().int().min(1, 'Total stages must be at least 1')
});

/**
 * 🛡️ FIELD REGISTRATION SCHEMA
 * Validates the farmer and geolocation details added to an inspection.
 */
export const fieldRegistrationSchema = z.object({
  farmerName: z.string().min(2, 'Farmer name is required and should be at least 2 characters'),
  farmerContact: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  fieldId: z.string().optional(),
  appNumber: z.string().optional(),
  // Geolocation is stored as decimals, so we accept numbers, numeric strings, or empty strings
  latitude: z.union([z.number(), z.string().regex(/^-?\d+(\.\d+)?$/), z.literal('')]).optional(),
  longitude: z.union([z.number(), z.string().regex(/^-?\d+(\.\d+)?$/), z.literal('')]).optional(),
  fieldLocation: z.string().optional(),
  fieldImageUrl: z.string().optional() // Allow base64 strings locally until Cloudinary is added
});

/**
 * 🛡️ STAGE DATA SCHEMA
 * Validates the submission of a specific inspection stage form.
 * 
 * formData is crop + stage specific (z.any() keeps it flexible):
 * 
 * Wheat Stage 1 (Vegetative):    { plantStand, offTypesCount, ... }
 * Wheat Stage 2 (Pre-Flowering): { morphologicalDeviationCount, floweringSynchrony, ... }
 * Wheat Stage 3 (Flowering):     { 
 *   counts: [{ totalPlants, offTypes, volunteerPlants, objectionableWeeds, 
 *              diseasedPlants, inseparableOtherCrops }],
 *   maturityUniformity, moistureEstimation, equipmentCleaned,
 *   separateThreshing, yieldEstimation, notes
 * }
 * Wheat Stage 4 (Pre-Harvest):   { ... }
 */
export const stageDataSchema = z.object({
  stageNumber: z.number().int().min(1, 'Stage number is required and must be positive'),
  stageName: z.string().optional(),
  formData: z.any(), // Allows dynamic custom JSON depending on the crop/stage
  notes: z.string().optional()
});

/**
 * 🛡️ REPORT SCHEMA
 * Validates the final verdict issuance for the inspection.
 */
export const reportSchema = z.object({
  verdict: z.enum(['Approved', 'Provisional Approval', 'Rejected'], {
    errorMap: () => ({ message: 'Invalid verdict provided' })
  }),
  summaryNotes: z.string().optional(),
  pdfUrl: z.string().url('Invalid PDF URL').optional().or(z.literal(''))
});
