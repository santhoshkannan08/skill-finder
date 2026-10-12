const BANDS = [[0, 'Foundation Needed'], [40, 'Developing'], [60, 'Proficient'], [80, 'Strong']];
const number = (value) => Number(value || 0);

export function bandFor(score) {
  return [...BANDS].reverse().find(([threshold]) => score >= threshold)[1];
}

export function scoreQuestion(question, answer) {
  const maxPoints = number(question.max_points);
  if (!answer) return { earnedPoints: 0, maxPoints };
  if (question.question_type === 'scale') return { earnedPoints: maxPoints * (number(answer.answer_value) / 100), maxPoints };
  const selected = new Set((answer.option_ids?.length ? answer.option_ids : [answer.option_id]).filter(Boolean).map(Number));
  const correct = question.options.filter((option) => option.is_correct).map((option) => Number(option.id));
  if (question.question_type === 'multi_choice' || question.scoring_policy === 'partial_set') {
    const correctSelected = [...selected].filter((id) => correct.includes(id)).length;
    const incorrectSelected = [...selected].filter((id) => !correct.includes(id)).length;
    const fraction = correct.length ? Math.max(0, (correctSelected - incorrectSelected) / correct.length) : 0;
    return { earnedPoints: maxPoints * Math.min(1, fraction), maxPoints };
  }
  const option = question.options.find((item) => Number(item.id) === Number(answer.option_id));
  return { earnedPoints: option?.is_correct ? maxPoints : 0, maxPoints };
}

export function calculateResults(questions, answers, prerequisites = []) {
  const answerMap = new Map(answers.map((answer) => [Number(answer.question_id), answer]));
  const skillTotals = new Map();
  const answerScores = [];
  for (const question of questions) {
    const score = scoreQuestion(question, answerMap.get(Number(question.id)));
    answerScores.push({ questionId: Number(question.id), ...score });
    for (const mapping of question.mappings || []) {
      const current = skillTotals.get(Number(mapping.skill_id)) || { skillId: Number(mapping.skill_id), name: mapping.skill_name, earned: 0, maximum: 0, evidence: 0 };
      const weight = number(mapping.weight);
      current.earned += score.earnedPoints * weight;
      current.maximum += score.maxPoints * weight;
      current.evidence += answerMap.has(Number(question.id)) ? 1 : 0;
      skillTotals.set(current.skillId, current);
    }
  }
  const skills = [...skillTotals.values()].map((item) => {
    const assessed = item.evidence >= 2 && item.maximum > 0;
    const score = assessed ? Math.round((item.earned / item.maximum) * 10000) / 100 : 0;
    const band = bandFor(score);
    return { ...item, score, band, assessed, explanation: assessed ? `${item.name} is ${band.toLowerCase()} based on ${item.evidence} answered questions.` : `${item.name} needs more evidence before it can be classified confidently.` };
  });
  const strengths = skills.filter((skill) => skill.assessed && skill.score >= 60).sort((a, b) => b.score - a.score).slice(0, 3);
  const gaps = skills.filter((skill) => !skill.assessed || skill.score < 60).sort((a, b) => a.score - b.score);
  const skillById = new Map(skills.map((skill) => [skill.skillId, skill]));
  const prerequisiteGaps = prerequisites
    .filter((edge) => {
      const prerequisite = skillById.get(Number(edge.prerequisite_skill_id));
      return skills.some((skill) => skill.skillId === Number(edge.skill_id) && (!skill.assessed || skill.score < 60)) &&
        (!prerequisite || !prerequisite.assessed || prerequisite.score < 60);
    })
    .map((edge) => ({ skillId: Number(edge.skill_id), prerequisiteSkillId: Number(edge.prerequisite_skill_id), prerequisiteSkill: edge.prerequisite_name }));
  return { skills, strengths, gaps, prerequisiteGaps, priorities: gaps.slice(0, 3).map((skill) => ({ skillId: skill.skillId, skill: skill.name, reason: skill.assessed ? 'Build this skill to close a demonstrated gap.' : 'Complete more evidence before prioritizing this skill.' })), answerScores };
}
