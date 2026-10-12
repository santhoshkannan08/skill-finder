import test from 'node:test';
import assert from 'node:assert/strict';
import { bandFor, calculateResults, scoreQuestion } from '../src/services/scoringService.js';

const question = {
  id: 1,
  question_type: 'single_choice',
  scoring_policy: 'exact',
  max_points: 2,
  options: [{ id: 10, is_correct: true }, { id: 11, is_correct: false }]
};

test('uses the configured score bands', () => {
  assert.equal(bandFor(39), 'Foundation Needed');
  assert.equal(bandFor(40), 'Developing');
  assert.equal(bandFor(60), 'Proficient');
  assert.equal(bandFor(80), 'Strong');
});

test('scores an exact answer and rejects an incorrect answer', () => {
  assert.deepEqual(scoreQuestion(question, { option_id: 10 }), { earnedPoints: 2, maxPoints: 2 });
  assert.deepEqual(scoreQuestion(question, { option_id: 11 }), { earnedPoints: 0, maxPoints: 2 });
});

test('does not award full marks when every multi-choice option is selected', () => {
  const multi = { ...question, question_type: 'multi_choice', scoring_policy: 'partial_set', options: [
    { id: 10, is_correct: true }, { id: 12, is_correct: true }, { id: 11, is_correct: false }
  ] };
  assert.equal(scoreQuestion(multi, { option_ids: [10, 12] }).earnedPoints, 2);
  assert.equal(scoreQuestion(multi, { option_ids: [10, 11, 12] }).earnedPoints, 1);
});

test('requires evidence before classifying a skill and reports prerequisite gaps', () => {
  const questions = [
    { ...question, mappings: [{ skill_id: 1, skill_name: 'Advanced skill', weight: 1 }] },
    { ...question, id: 2, mappings: [{ skill_id: 1, skill_name: 'Advanced skill', weight: 1 }] }
  ];
  const result = calculateResults(questions, [{ question_id: 1, option_id: 11 }], [
    { skill_id: 1, prerequisite_skill_id: 2, prerequisite_name: 'Prerequisite skill' }
  ]);
  assert.equal(result.skills[0].assessed, false);
  assert.deepEqual(result.prerequisiteGaps, [{ skillId: 1, prerequisiteSkillId: 2, prerequisiteSkill: 'Prerequisite skill' }]);
});
