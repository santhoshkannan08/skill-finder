import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoadmapPlan, topologicalSkills } from '../src/services/roadmapEngine.js';

const skills = [{ id: 1, name: 'Advanced', difficulty: 2 }, { id: 2, name: 'Foundation', difficulty: 1 }];

test('orders prerequisites before dependent skills', () => {
  assert.deepEqual(topologicalSkills(skills, [{ skill_id: 1, prerequisite_skill_id: 2 }]).map((skill) => skill.id), [2, 1]);
});

test('rejects prerequisite cycles', () => {
  assert.throws(() => topologicalSkills(skills, [{ skill_id: 1, prerequisite_skill_id: 2 }, { skill_id: 2, prerequisite_skill_id: 1 }]), /cycle/i);
});

test('rejects schedules that exceed available study time', () => {
  assert.throws(() => buildRoadmapPlan({
    skills, prerequisites: [], results: [], resources: [], targetDurationDays: 30, availableHours: 1, preferredMethod: 'mixed'
  }), /needs about/i);
});

test('creates a feasible ordered plan with a mastery refresh', () => {
  const plan = buildRoadmapPlan({
    skills, prerequisites: [{ skill_id: 1, prerequisite_skill_id: 2 }],
    results: [{ skill_id: 2, score: 90, evidence_count: 3, assessed: true }, { skill_id: 1, score: 20, evidence_count: 3, assessed: true }],
    resources: [], targetDurationDays: 60, availableHours: 20, preferredMethod: 'practice'
  });
  assert.equal(plan.feasible, true);
  assert.equal(plan.phases[0].tasks[0].skillId, 2);
  assert.match(plan.phases[0].tasks[0].title, /Refresh/);
});
