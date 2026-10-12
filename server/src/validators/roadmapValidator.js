import { z } from 'zod';

const id = z.coerce.number().int().positive();
export const generateRoadmapSchema = z.object({
  assessmentId: id,
  targetDurationDays: z.coerce.number().int().refine((value) => [30, 60, 90, 180].includes(value) || (value >= 1 && value <= 730), 'Target duration must be 30, 60, 90, 180 or a custom value from 1 to 730 days')
});
export const updateRoadmapSchema = z.object({
  status: z.enum(['active', 'completed', 'archived']).optional()
}).refine((value) => Object.keys(value).length > 0, 'At least one roadmap field is required');
export const updateTaskSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed'])
});
