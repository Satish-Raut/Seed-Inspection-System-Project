import jwt from 'jsonwebtoken';

/**
 * Generate a short-lived Access Token (e.g., 15 minutes).
 * This token is sent in the Authorization header.
 * @param {number} id - The internal database ID of the inspector.
 * @returns {string} - Signed JWT Access Token.
 */
export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

/**
 * Generate a long-lived Refresh Token (e.g., 7 days).
 * This token is stored in a secure httpOnly cookie.
 * @param {number} id - The internal database ID of the inspector.
 * @returns {string} - Signed JWT Refresh Token.
 */
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
