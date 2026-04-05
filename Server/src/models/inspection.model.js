import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { inspections, fieldRegistrations, stageData } from './schema.js';

/**
 * 🗄️ CREATE INSPECTION
 * Inserts a new inspection record linked to an inspector.
 */
export const createInspectionDb = async (data, inspectorId) => {
  const [result] = await db.insert(inspections).values({
    ...data,
    inspectorId
  });
  
  // Return the newly created record ID
  return result.insertId;
};

/**
 * 🗄️ UPDATE INSPECTION
 * Modifies an existing inspection's base properties (e.g. crop type, stages).
 */
export const updateInspectionDb = async (inspectionId, data) => {
  await db.update(inspections)
    .set(data)
    .where(eq(inspections.id, inspectionId));
};

/**
 * 🗄️ GET ALL INSPECTIONS FOR AN INSPECTOR
 * Fetches summary list of all inspections belonging to the logged-in user.
 */
export const getInspectionsByInspector = async (inspectorId) => {
  return await db.query.inspections.findMany({
    where: eq(inspections.inspectorId, inspectorId),
    orderBy: (inspections, { desc }) => [desc(inspections.createdAt)],
    with: {
      fieldRegistration: true,
      stageData: true
    }
  });
};

/**
 * 🗄️ GET FULL INSPECTION WITH DETAILS
 * Powerful relational query fetching the inspection PLUS its linked field data and stages.
 */
export const getInspectionWithDetails = async (inspectionId) => {
  return await db.query.inspections.findFirst({
    where: eq(inspections.id, inspectionId),
    with: {
      fieldRegistration: true,
      stageData: true
    }
  });
};

/**
 * 🗄️ UPSERT FIELD REGISTRATION
 * Updates if exists, otherwise inserts new field details for an inspection.
 */
export const upsertFieldRegistrationDb = async (inspectionId, data) => {
  // Check if it already exists
  const existing = await db.query.fieldRegistrations.findFirst({
    where: eq(fieldRegistrations.inspectionId, inspectionId)
  });

  if (existing) {
    // Update
    await db.update(fieldRegistrations)
      .set(data)
      .where(eq(fieldRegistrations.inspectionId, inspectionId));
    return { ...existing, ...data };
  } else {
    // Insert
    const [result] = await db.insert(fieldRegistrations).values({
      inspectionId,
      ...data
    });
    return { id: result.insertId, inspectionId, ...data };
  }
};

/**
 * 🗄️ INSERT STAGE DATA
 * Adds a new stage submission record for an inspection.
 */
export const insertStageDataDb = async (inspectionId, data) => {
  const [result] = await db.insert(stageData).values({
    inspectionId,
    ...data,
    completedAt: new Date()
  });
  
  return result.insertId;
};

/**
 * 🗄️ UPDATE STAGE DATA
 * Updates an existing stage record.
 */
export const updateStageDataDb = async (stageId, data) => {
  await db.update(stageData)
    .set(data)
    .where(eq(stageData.id, stageId));
};

/**
 * 🗄️ CREATE FINAL REPORT
 * Issues the verdict/certificate.
 */
import { reports } from './schema.js';

export const createReportDb = async (data) => {
  const [result] = await db.insert(reports).values(data);
  return result.insertId;
};

/**
 * 🗄️ GET ALL REPORTS
 */
export const getAllReportsDb = async () => {
  return await db.query.reports.findMany({
    orderBy: (reports, { desc }) => [desc(reports.createdAt)],
    with: {
      inspection: {
        with: {
          fieldRegistration: true,
          inspector: true
        }
      }
    }
  });
};
