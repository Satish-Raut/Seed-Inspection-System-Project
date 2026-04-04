import { z } from "zod";

/**
 * 🛡️ REGISTER VALIDATION SCHEMA
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().optional(),
  designation: z.string().optional(),
  region: z.string().optional(),
});

/**
 * 🛡️ LOGIN VALIDATION SCHEMA
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
