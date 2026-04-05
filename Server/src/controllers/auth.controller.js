import { 
  findUserByEmail, 
  findUserById, 
  createUser, 
  updateRefreshToken 
} from '../models/user.model.js';
import { 
  registerSchema, 
  loginSchema 
} from '../validations/auth.validation.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { generateInspectorId } from '../utils/generateInspectorId.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

/**
 * 🔒 COOKIE OPTIONS
 * httpOnly: Prevent XSS access to the cookie.
 * secure:   Only send over HTTPS (if in production).
 * sameSite: Prevent CSRF.
 */
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register a new inspector.
 * (MVC Refactored: Uses Validation layer and Model layer)
 */
export const register = async (req, res) => {
  try {
    // 1. Validate Input (Using Validation Layer)
    const validatedData = registerSchema.parse(req.body);
    console.log("Data from Frontend for registration: ", req.body)

    // 2. Check if user already exists (Using Model Layer)
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Inspector already registered with this email' });
    }

    // 3. Prepare User Data (Hash, Generate ID)
    const hashedPassword = await hashPassword(validatedData.password);
    const inspectorId = await generateInspectorId();

    // 4. Create New Inspector (Using Model Layer)
    const result = await createUser({
      ...validatedData,
      password: hashedPassword,
      inspectorId,
    });

    const newUserId = result.insertId;

    // 5. Generate Dual Tokens
    const accessToken = generateAccessToken(newUserId);
    const refreshToken = generateRefreshToken(newUserId);

    // 6. Save Refresh Token (Using Model Layer)
    await updateRefreshToken(newUserId, refreshToken);

    // 7. Set Secure Cookie & Respond
    res.cookie('si_refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    
    res.status(201).json({
      message: 'Registration successful!',
      accessToken,
      user: {
        id: newUserId,
        inspectorId,
        name: validatedData.name,
        email: validatedData.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to register inspector' });
  }
};

/**
 * Login an existing inspector.
 * (MVC Refactored: Uses Validation layer and Model layer)
 */
export const login = async (req, res) => {
  try {
    // 1. Validate Input (Using Validation Layer)
    const validatedData = loginSchema.parse(req.body);

    // 2. Find user by email (Using Model Layer)
    const user = await findUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Verify hashed password (Argon2)
    const isValid = await verifyPassword(user.password, validatedData.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Generate Dual Tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // 5. Update Refresh Token (Using Model Layer)
    await updateRefreshToken(user.id, refreshToken);

    // 6. Set Secure Cookie & Respond
    res.cookie('si_refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.json({
      message: 'Login successful!',
      accessToken,
      user: {
        id: user.id,
        inspectorId: user.inspectorId,
        name: user.name,
        email: user.email,
        designation: user.designation,
        region: user.region,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
    }
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Refresh Access Token.
 * (MVC Refactored: Uses Model layer for user verification)
 */
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.si_refresh_token;
    if (!refreshToken) {
       return res.status(401).json({ error: 'No refresh token provided' });
    }

    // 1. Verify token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // 2. Verify token matches DB (Using Model Layer)
    const user = await findUserById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
       return res.status(403).json({ error: 'Invalid refresh token - please login again' });
    }

    // 3. Issue new tokens (Token Rotation)
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // 4. Update DB & Cookie (Using Model Layer)
    await updateRefreshToken(user.id, newRefreshToken);
    res.cookie('si_refresh_token', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh Error:', error);
    res.status(403).json({ error: 'Session expired' });
  }
};

/**
 * Logout - Clear session.
 * (MVC Refactored: Uses Model layer for token cleanup)
 */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.si_refresh_token;
    
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded && decoded.id) {
        // Clear token from DB (Using Model Layer)
        await updateRefreshToken(decoded.id, null);
      }
    }

    // Clear client-side cookie
    res.clearCookie('si_refresh_token', { 
       httpOnly: true, 
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict'
    });
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

/**
 * Get current profile (authenticated).
 */
export const getMe = async (req, res) => {
  try {
    // Using Model Layer
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, refreshToken, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
