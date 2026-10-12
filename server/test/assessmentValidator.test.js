import test from 'node:test';
import assert from 'node:assert/strict';
import { answerSchema, createAssessmentSchema } from '../src/validators/assessmentValidator.js';

test('rejects an answer without a supported value', () => {
  assert.equal(answerSchema.safeParse({}).success, false);
  assert.equal(answerSchema.safeParse({ optionIds: [4] }).success, true);
});

test('rejects invalid assessment preferences', () => {
  assert.equal(createAssessmentSchema.safeParse({
    fieldId: 1, learningPathId: 2, learningGoal: 'Learn',
    experienceLevel: 'expert', targetDurationWeeks: 8,
    studyHoursPerWeek: 5, preferredLearningMethod: 'mixed'
  }).success, false);
});
