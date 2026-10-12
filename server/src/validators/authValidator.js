import { z } from 'zod';

const password = z.string().min(8).max(128).regex(/[A-Z]/, 'Password must contain an uppercase letter').regex(/[a-z]/, 'Password must contain a lowercase letter').regex(/[0-9]/, 'Password must contain a number');
export const registerSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254), password });
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(1).max(128) });
