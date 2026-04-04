import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { inspectors } from './schema.js';

/**
 * 🗄️ USER MODEL
 * Encapsulates all database interactions for the 'inspectors' table.
 * This separates the Data Access Layer from the Controller's business logic.
 */

/**
 * Find an inspector by their email address.
 * @param {string} email 
 * @returns {Promise<Object|null>}
 */
export const findUserByEmail = async (email) => {
  const [user] = await db.select().from(inspectors).where(eq(inspectors.email, email));
  return user || null;
};

/**
 * Find an inspector by their internal database ID.
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
export const findUserById = async (id) => {
  const [user] = await db.select().from(inspectors).where(eq(inspectors.id, id));
  return user || null;
};

/**
 * Create a new inspector record.
 * @param {Object} userData 
 * @returns {Promise<Object>} - Contains insertId.
 */
export const createUser = async (userData) => {
  const [result] = await db.insert(inspectors).values(userData);
  return result;
};

/**
 * Update the refresh token for a specific inspector.
 * Used for session persistence and token rotation.
 * @param {number} userId 
 * @param {string|null} token 
 */
export const updateRefreshToken = async (userId, token) => {
  return await db
    .update(inspectors)
    .set({ refreshToken: token })
    .where(eq(inspectors.id, userId));
};
