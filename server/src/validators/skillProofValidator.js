import { z } from 'zod';

const id = z.coerce.number().int().positive();
export const quizSubmissionSchema = z.object({
  answers: z.array(z.object({ questionId: id, optionIds: z.array(id).min(1).max(8) }).strict()).min(1).max(5)
}).strict();
export const evidenceSchema = z.object({
  skillId: id,
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(20).max(5000),
  sourceType: z.enum(['text', 'url']),
  content: z.string().trim().min(20).max(5000).optional(),
  evidenceUrl: z.string().url().max(2048).optional()
}).strict().superRefine((value, context) => {
  if (value.sourceType === 'text' && !value.content) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Text evidence is required.' });
  if (value.sourceType === 'url' && !value.evidenceUrl) context.addIssue({ code: z.ZodIssueCode.custom, message: 'A valid evidence URL is required.' });
});
