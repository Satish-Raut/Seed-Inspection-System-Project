import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { inspectors } from '../models/schema.js';

/**
 * Generate a unique Inspector ID.
 * Format: INS-YYYY-001, INS-YYYY-002, etc.
 * @returns {Promise<string>} - The generated Inspector ID.
 */
export const generateInspectorId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get the count of existing inspectors to determine the next serial number.
    const [result] = await db.select({ count: sql`count(*)` }).from(inspectors);
    const nextNumber = (Number(result.count) + 1).toString().padStart(3, '0');
    
    return `INS-${currentYear}-${nextNumber}`;
  } catch (error) {
    console.error('Error generating Inspector ID:', error);
    // Fallback to a timestamp based ID if the DB check fails.
    return `INS-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  }
};
