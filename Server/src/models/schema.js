import { 
  mysqlTable, 
  int, 
  varchar, 
  text, 
  timestamp, 
  decimal, 
  mysqlEnum, 
  json, 
  boolean 
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

/**
 * 🗄️ MODELS / SCHEMA DEFINITION
 * This file defines the shape of our MySQL database using Drizzle ORM.
 * All table relationships and constraints (like cascade deletes) are defined here.
 */

// 1. Inspectors Table
export const inspectors = mysqlTable('inspectors', {
  id:           int('id').autoincrement().primaryKey(),
  inspectorId:  varchar('inspector_id', { length: 20 }).notNull().unique(), 
  name:         varchar('name', { length: 100 }).notNull(),
  email:        varchar('email', { length: 100 }).notNull().unique(),
  password:     varchar('password', { length: 255 }).notNull(),
  phone:        varchar('phone', { length: 15 }),
  designation:  varchar('designation', { length: 100 }),
  region:       varchar('region', { length: 100 }),
  role:         mysqlEnum('role', ['inspector', 'admin']).default('inspector'),
  refreshToken: varchar('refresh_token', { length: 500 }),
  createdAt:    timestamp('created_at').defaultNow(),
});

// 2. Inspections Table
export const inspections = mysqlTable('inspections', {
  id:             int('id').autoincrement().primaryKey(),
  inspectorId:    int('inspector_id').references(() => inspectors.id, { onDelete: 'cascade' }),
  cropType:       mysqlEnum('crop_type', ['Wheat', 'Rice', 'Maize', 'Sorghum', 'Sunflower']).notNull(),
  productionType: mysqlEnum('production_type', ['Hybrid', 'Non-Hybrid']).notNull(),
  totalStages:    int('total_stages').notNull(),
  status:         mysqlEnum('status', ['In Progress', 'Completed', 'Rejected']).default('In Progress'),
  createdAt:      timestamp('created_at').defaultNow(),
  updatedAt:      timestamp('updated_at').onUpdateNow(),
});

// 3. Field Registrations Table
export const fieldRegistrations = mysqlTable('field_registrations', {
  id:             int('id').autoincrement().primaryKey(),
  inspectionId:   int('inspection_id').references(() => inspections.id, { onDelete: 'cascade' }),
  farmerName:     varchar('farmer_name', { length: 100 }).notNull(),
  farmerContact:  varchar('farmer_contact', { length: 15 }),
  village:        varchar('village', { length: 100 }),
  district:       varchar('district', { length: 100 }),
  fieldId:        varchar('field_id', { length: 50 }),
  appNumber:      varchar('app_number', { length: 50 }),
  latitude:       decimal('latitude', { precision: 10, scale: 8 }),
  longitude:      decimal('longitude', { precision: 11, scale: 8 }),
  fieldLocation:  text('field_location'),
  fieldImageUrl:  varchar('field_image_url', { length: 500 }),
  createdAt:      timestamp('created_at').defaultNow(),
});

// 4. Stage Data Table
export const stageData = mysqlTable('stage_data', {
  id:                   int('id').autoincrement().primaryKey(),
  inspectionId:         int('inspection_id').references(() => inspections.id, { onDelete: 'cascade' }),
  stageNumber:          int('stage_number').notNull(),
  stageName:            varchar('stage_name', { length: 100 }),
  formData:             json('form_data'), // Stores all per-crop specific inputs
  notes:                text('notes'),
  completedAt:          timestamp('completed_at'),
});

// 5. Stage Photos Table
export const stagePhotos = mysqlTable('stage_photos', {
  id:           int('id').autoincrement().primaryKey(),
  stageDataId:  int('stage_data_id').references(() => stageData.id, { onDelete: 'cascade' }),
  photoUrl:     varchar('photo_url', { length: 500 }).notNull(),
  caption:      varchar('caption', { length: 255 }),
  uploadedAt:   timestamp('uploaded_at').defaultNow(),
});

// 6. Reports Table
export const reports = mysqlTable('reports', {
  id:             int('id').autoincrement().primaryKey(),
  inspectionId:   int('inspection_id').references(() => inspections.id, { onDelete: 'cascade' }),
  verdict:        mysqlEnum('verdict', ['Approved', 'Provisional Approval', 'Rejected']).notNull(),
  summaryNotes:   text('summary_notes'),
  pdfUrl:         varchar('pdf_url', { length: 500 }),
  emailSent:      boolean('email_sent').default(false),
  createdAt:      timestamp('created_at').defaultNow(),
});

/* ==========================================================================
   🔗 RELATIONSHIPS (Drizzle ORM)
   These define how tables connect. We use this to write powerful relational 
   queries like: db.query.inspectors.findFirst({ with: { inspections: true } })
   ========================================================================== */

// 1. Inspector -> Inspections (One-to-Many)
export const inspectorsRelations = relations(inspectors, ({ many }) => ({
  inspections: many(inspections),
}));

// 2. Inspection -> Inspector (Many-to-One), Stage Data, Reports, Field Registration
export const inspectionsRelations = relations(inspections, ({ one, many }) => ({
  inspector: one(inspectors, {
    fields: [inspections.inspectorId],
    references: [inspectors.id],
  }),
  fieldRegistration: one(fieldRegistrations, {
    fields: [inspections.id],
    references: [fieldRegistrations.inspectionId],
  }),
  stageData: many(stageData),
  report: one(reports, {
    fields: [inspections.id],
    references: [reports.inspectionId],
  })
}));

// 3. Stage Data -> Inspection (Many-to-One), Stage Photos (One-to-Many)
export const stageDataRelations = relations(stageData, ({ one, many }) => ({
  inspection: one(inspections, {
    fields: [stageData.inspectionId],
    references: [inspections.id],
  }),
  photos: many(stagePhotos),
}));

// 4. Stage Photos -> Stage Data (Many-to-One)
export const stagePhotosRelations = relations(stagePhotos, ({ one }) => ({
  stageData: one(stageData, {
    fields: [stagePhotos.stageDataId],
    references: [stageData.id],
  }),
}));
