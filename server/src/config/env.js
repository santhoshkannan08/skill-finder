import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).optional(),
  SESSION_SECRET: z.string().min(32).default('development-only-change-me-please-32-chars'),
  GEMINI_API_KEY: z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string().trim().min(1).optional()
  ),
  GEMINI_MODEL: z.string().trim().min(1).default('gemini-2.5-flash'),
  GEMINI_ENABLED: z.preprocess((value) => value === true || value === 'true' || value === '1', z.boolean()).default(false)
}).superRefine((config, context) => {
  if (config.NODE_ENV === 'production' && (
    config.SESSION_SECRET === 'development-only-change-me-please-32-chars'
    || config.SESSION_SECRET === 'replace-with-a-long-random-secret'
  )) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['SESSION_SECRET'],
      message: 'SESSION_SECRET must be explicitly configured in production'
    });
  }
  if (config.GEMINI_ENABLED && !config.GEMINI_API_KEY) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['GEMINI_API_KEY'],
      message: 'GEMINI_API_KEY is required when GEMINI_ENABLED is true'
    });
  }
});

export const env = schema.parse(process.env);
