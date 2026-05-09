import { eq, desc, inArray } from 'drizzle-orm';
import { db } from '../db/index.js';
import { inspections, fieldRegistrations, stageData, reports, inspectors } from './schema.js';

/**
 * 🗄️ CREATE INSPECTION
 * Inserts a new inspection record linked to an inspector.
 */
export const createInspectionDb = async (data, inspectorId) => {
  const [result] = await db.insert(inspections).values({
    ...data,
    inspectorId
  });
  return result.insertId;
};

/**
 * 🗄️ UPDATE INSPECTION
 * Modifies an existing inspection's base properties.
 */
export const updateInspectionDb = async (inspectionId, data) => {
  await db.update(inspections)
    .set(data)
    .where(eq(inspections.id, inspectionId));
};

/**
 * 🗄️ GET ALL INSPECTIONS FOR AN INSPECTOR
 * Uses separate queries instead of lateral joins for TiDB compatibility.
 */
export const getInspectionsByInspector = async (inspectorId) => {
  // 1. Get all inspections
  const inspectionList = await db.select()
    .from(inspections)
    .where(eq(inspections.inspectorId, inspectorId))
    .orderBy(desc(inspections.createdAt));

  if (inspectionList.length === 0) return [];

  const ids = inspectionList.map(i => i.id);

  // 2. Get field registrations for all inspections
  const fieldRegs = await db.select()
    .from(fieldRegistrations)
    .where(inArray(fieldRegistrations.inspectionId, ids));

  // 3. Get stage data for all inspections
  const stages = await db.select()
    .from(stageData)
    .where(inArray(stageData.inspectionId, ids));

  // 4. Combine into one object per inspection
  return inspectionList.map(inspection => ({
    ...inspection,
    fieldRegistration: fieldRegs.find(f => f.inspectionId === inspection.id) || null,
    stageData: stages.filter(s => s.inspectionId === inspection.id),
  }));
};

/**
 * 🗄️ GET FULL INSPECTION WITH DETAILS
 * Fetches the inspection + its field registration and stage data separately.
 */
export const getInspectionWithDetails = async (inspectionId) => {
  // 1. Get inspection
  const [inspection] = await db.select()
    .from(inspections)
    .where(eq(inspections.id, inspectionId));

  if (!inspection) return null;

  // 2. Get field registration
  const [fieldReg] = await db.select()
    .from(fieldRegistrations)
    .where(eq(fieldRegistrations.inspectionId, inspectionId));

  // 3. Get stage data
  const stages = await db.select()
    .from(stageData)
    .where(eq(stageData.inspectionId, inspectionId));

  return {
    ...inspection,
    fieldRegistration: fieldReg || null,
    stageData: stages,
  };
};

/**
 * 🗄️ UPSERT FIELD REGISTRATION
 */
export const upsertFieldRegistrationDb = async (inspectionId, data) => {
  const [existing] = await db.select()
    .from(fieldRegistrations)
    .where(eq(fieldRegistrations.inspectionId, inspectionId));

  if (existing) {
    await db.update(fieldRegistrations)
      .set(data)
      .where(eq(fieldRegistrations.inspectionId, inspectionId));
    return { ...existing, ...data };
  } else {
    const [result] = await db.insert(fieldRegistrations).values({
      inspectionId,
      ...data
    });
    return { id: result.insertId, inspectionId, ...data };
  }
};

/**
 * 🗄️ INSERT STAGE DATA
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
 */
export const updateStageDataDb = async (stageId, data) => {
  await db.update(stageData)
    .set(data)
    .where(eq(stageData.id, stageId));
};

/**
 * 🗄️ CREATE FINAL REPORT
 */
import { reports as reportsTable } from './schema.js';

export const createReportDb = async (data) => {
  const [result] = await db.insert(reportsTable).values(data);
  return result.insertId;
};

/**
 * 🗄️ GET ALL REPORTS
 * Uses separate queries instead of lateral joins for TiDB compatibility.
 */
export const getAllReportsDb = async () => {
  // 1. Get all reports
  const allReports = await db.select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt));

  if (allReports.length === 0) return [];

  const inspectionIds = allReports.map(r => r.inspectionId).filter(Boolean);

  // 2. Get related inspections
  const relatedInspections = await db.select()
    .from(inspections)
    .where(inArray(inspections.id, inspectionIds));

  const inspectorIds = relatedInspections.map(i => i.inspectorId).filter(Boolean);

  // 3. Get related inspectors
  const relatedInspectors = await db.select()
    .from(inspectors)
    .where(inArray(inspectors.id, inspectorIds));

  // 4. Get related field registrations
  const relatedFieldRegs = await db.select()
    .from(fieldRegistrations)
    .where(inArray(fieldRegistrations.inspectionId, inspectionIds));

  // 5. Combine everything
  return allReports.map(report => {
    const inspection = relatedInspections.find(i => i.id === report.inspectionId) || null;
    const inspector = inspection
      ? relatedInspectors.find(i => i.id === inspection.inspectorId) || null
      : null;
    const fieldReg = inspection
      ? relatedFieldRegs.find(f => f.inspectionId === inspection.id) || null
      : null;

    return {
      ...report,
      inspection: inspection ? {
        ...inspection,
        fieldRegistration: fieldReg,
        inspector,
      } : null,
    };
  });
};
