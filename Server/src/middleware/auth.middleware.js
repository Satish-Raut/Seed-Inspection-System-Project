import jwt from 'jsonwebtoken';

/**
 * verifyToken - Protect private API routes.
 * This middleware authenticates users based on the Access Token in the Authorization header.
 * 
 * Logic:
 * 1. Check for 'Authorization' header.
 * 2. Validate format: 'Bearer <token>'.
 * 3. Verify JWT using the ACCESS secret.
 * 4. Pass decoded user data to the next handler via req.user.
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Initial Authentication failed - no token provided' });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      // Attach decoded user data (e.g. { id: 101 }) to request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Verify Token Error:', error);
    res.status(500).json({ error: 'Internal Authentication status error' });
  }
};
