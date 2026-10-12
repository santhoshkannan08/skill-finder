import { z } from 'zod';

const id = z.coerce.number().int().positive();
export const createAssessmentSchema = z.object({
  fieldId: id,
  learningPathId: id,
  learningGoal: z.string().trim().min(3).max(500),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  targetDurationWeeks: z.coerce.number().int().min(1).max(104),
  studyHoursPerWeek: z.coerce.number().positive().max(168),
  preferredLearningMethod: z.string().trim().min(2).max(80)
});
export const answerSchema = z.object({
  optionId: id.optional(),
  optionIds: z.array(id).max(20).optional(),
  answerValue: z.coerce.number().min(0).max(100).optional()
}).refine((value) => value.optionId || (value.optionIds && value.optionIds.length) || value.answerValue !== undefined, 'An answer is required');
