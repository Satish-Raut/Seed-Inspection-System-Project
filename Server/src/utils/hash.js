import argon2 from 'argon2';

/**
 * Hash a plain text password using Argon2.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password) => {
  try {
    // Argon2 handles salting automatically.
    return await argon2.hash(password);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Verify a plain text password against a hashed password.
 * @param {string} hashedPassword - The salted hash from the DB.
 * @param {string} password - The plain text password to check.
 * @returns {Promise<boolean>} - True if they match, else false.
 */
export const verifyPassword = async (hashedPassword, password) => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Password verification failed');
  }
};
