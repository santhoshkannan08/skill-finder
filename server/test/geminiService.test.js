import test from 'node:test';
import assert from 'node:assert/strict';
import { env } from '../src/config/env.js';
import { personalizeRoadmap } from '../src/services/geminiService.js';

const context = {
  field: 'Technology and IT',
  goal: 'Become a web developer',
  skillScores: [{ skillId: 1, score: 45, band: 'Developing', assessed: true }],
  gaps: [1],
  strengths: [],
  availableStudyHours: 6,
  targetDurationDays: 60,
  tasks: [{ skillId: 1, title: 'Build HTML', durationMinutes: 180 }],
  skills: [{ id: 1, name: 'HTML' }],
  resources: [{ id: 10, skill_id: 1, title: 'MDN HTML', resource_type: 'article' }]
};

const valid = {
  assessmentExplanation: 'Your assessment shows a developing foundation in HTML.',
  learningStrategies: ['Use short practice cycles and review mistakes.'],
  practiceActivities: ['Build a semantic profile page.'],
  projects: [{ title: 'Accessible profile page', description: 'Create a responsive profile page with semantic HTML.', skillIds: [1], durationDays: 5 }],
  taskRefinements: [{ skillId: 1, practiceInstructions: 'Add landmarks and validate the page.' }],
  resourceSelections: [{ skillId: 1, resourceIds: [10] }]
};

test('returns a deterministic fallback when Gemini is disabled', async () => {
  const original = { enabled: env.GEMINI_ENABLED, key: env.GEMINI_API_KEY };
  env.GEMINI_ENABLED = false;
  env.GEMINI_API_KEY = undefined;
  let called = false;
  const result = await personalizeRoadmap(context, { fetchImpl: async () => { called = true; } });
  assert.deepEqual(result, { status: 'unavailable', reason: 'disabled', recommendations: null });
  assert.equal(called, false);
  Object.assign(env, { GEMINI_ENABLED: original.enabled, GEMINI_API_KEY: original.key });
});

test('accepts a valid provider response and restricts it to supplied catalogue IDs', async () => {
  const original = { enabled: env.GEMINI_ENABLED, key: env.GEMINI_API_KEY };
  env.GEMINI_ENABLED = true;
  env.GEMINI_API_KEY = 'test-key';
  const result = await personalizeRoadmap(context, {
    fetchImpl: async () => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(valid) }] } }] }) })
  });
  assert.equal(result.status, 'personalized');
  assert.equal(result.recommendations.resourceSelections[0].resourceIds[0], 10);
  Object.assign(env, { GEMINI_ENABLED: original.enabled, GEMINI_API_KEY: original.key });
});

test('falls back when Gemini returns an unknown resource', async () => {
  const original = { enabled: env.GEMINI_ENABLED, key: env.GEMINI_API_KEY };
  env.GEMINI_ENABLED = true;
  env.GEMINI_API_KEY = 'test-key';
  const invalid = { ...valid, resourceSelections: [{ skillId: 1, resourceIds: [999] }] };
  const result = await personalizeRoadmap(context, {
    fetchImpl: async () => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(invalid) }] } }] }) })
  });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.reason, 'invalid_or_unavailable_response');
  Object.assign(env, { GEMINI_ENABLED: original.enabled, GEMINI_API_KEY: original.key });
});
