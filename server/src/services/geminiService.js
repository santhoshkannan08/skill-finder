import { z } from 'zod';
import { env } from '../config/env.js';

const recommendationSchema = z.object({
  assessmentExplanation: z.string().trim().min(1).max(2000),
  learningStrategies: z.array(z.string().trim().min(1).max(500)).max(6),
  practiceActivities: z.array(z.string().trim().min(1).max(500)).max(8),
  projects: z.array(z.object({
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(800),
    skillIds: z.array(z.number().int().positive()).max(12),
    durationDays: z.number().int().min(1).max(180)
  }).strict()).max(5),
  taskRefinements: z.array(z.object({
    skillId: z.number().int().positive(),
    learningObjective: z.string().trim().min(1).max(500).optional(),
    practiceInstructions: z.string().trim().min(1).max(700).optional(),
    durationMinutes: z.number().int().min(15).max(480).optional()
  }).strict()).max(30).refine((items) => items.every((item) => item.learningObjective || item.practiceInstructions || item.durationMinutes), 'A task refinement must contain a change.'),
  resourceSelections: z.array(z.object({
    skillId: z.number().int().positive(),
    resourceIds: z.array(z.number().int().positive()).max(4)
  }).strict()).max(30)
}).strict();

const forbidden = /(?:<\s*script|javascript:|data:text\/html|(?:select|insert|update|delete|drop)\s+.+\s+(?:from|into|table)|(?:rm|del|format)\s+[-/]|child_process|exec\s*\(|eval\s*\()/i;
const safeText = (value) => !forbidden.test(value);

function validateRecommendations(value, context) {
  const parsed = recommendationSchema.safeParse(value);
  if (!parsed.success) throw new Error('Gemini returned an invalid recommendation shape.');
  const skillIds = new Set(context.skills.map((skill) => Number(skill.id)));
  const resourceIds = new Set(context.resources.map((resource) => Number(resource.id)));
  const taskSkillIds = new Set(context.tasks.map((task) => Number(task.skillId)));
  const allText = [
    parsed.data.assessmentExplanation,
    ...parsed.data.learningStrategies,
    ...parsed.data.practiceActivities,
    ...parsed.data.projects.flatMap((project) => [project.title, project.description]),
    ...parsed.data.taskRefinements.flatMap((item) => [item.learningObjective, item.practiceInstructions].filter(Boolean))
  ];
  if (allText.some((text) => !safeText(text))) throw new Error('Gemini returned unsafe recommendation text.');
  if (parsed.data.projects.some((project) => project.skillIds.some((skillId) => !skillIds.has(skillId)))) throw new Error('Gemini returned an unknown skill.');
  if (parsed.data.taskRefinements.some((item) => !taskSkillIds.has(item.skillId))) throw new Error('Gemini returned a refinement for an unknown roadmap task.');
  if (parsed.data.resourceSelections.some((item) => !skillIds.has(item.skillId) || item.resourceIds.some((resourceId) => !resourceIds.has(resourceId)))) throw new Error('Gemini returned an unknown resource or skill.');
  const resourcesById = new Map(context.resources.map((resource) => [Number(resource.id), resource]));
  for (const selection of parsed.data.resourceSelections) {
    if (selection.resourceIds.some((resourceId) => Number(resourcesById.get(resourceId)?.skill_id) !== selection.skillId)) throw new Error('Gemini selected an unverified resource for a skill.');
  }
  return parsed.data;
}

async function requestGemini(prompt, fetchImpl, signal) {
  const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal,
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    })
  });
  if (!response.ok) {
    const error = new Error('Gemini request failed');
    error.retryable = response.status === 408 || response.status === 429 || response.status >= 500;
    throw error;
  }
  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
  if (!text) throw new Error('Gemini returned no recommendation content.');
  return JSON.parse(text);
}

export async function personalizeRoadmap(context, { fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  const fallback = (reason) => ({ status: 'unavailable', reason, recommendations: null });
  if (!env.GEMINI_ENABLED) return fallback('disabled');
  if (!env.GEMINI_API_KEY) return fallback('missing_configuration');
  const prompt = JSON.stringify({
    instruction: 'Return JSON matching the requested recommendation schema. Do not calculate scores, reorder prerequisites, invent URLs, or include resource URLs. Use only supplied skill and resource IDs.',
    field: context.field,
    goal: context.goal,
    skillScores: context.skillScores,
    gaps: context.gaps,
    strengths: context.strengths,
    availableStudyHours: context.availableStudyHours,
    targetDurationDays: context.targetDurationDays,
    tasks: context.tasks,
    skills: context.skills.map(({ id, name }) => ({ id, name })),
    resources: context.resources.map(({ id, title, resource_type: resourceType }) => ({ id, title, resourceType }))
  });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const raw = await requestGemini(prompt, fetchImpl, controller.signal);
      return { status: 'personalized', reason: null, recommendations: validateRecommendations(raw, context) };
    } catch (error) {
      if (attempt === 0 && error.retryable) continue;
      return fallback(error.name === 'AbortError' ? 'timeout' : 'invalid_or_unavailable_response');
    } finally {
      clearTimeout(timer);
    }
  }
  return fallback('unavailable');
}
