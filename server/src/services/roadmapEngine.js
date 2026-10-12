const MIN_EVIDENCE = 2;
const DAY_MINUTES = 60;

export function topologicalSkills(skills, edges) {
  const ids = new Set(skills.map((skill) => Number(skill.id)));
  const outgoing = new Map([...ids].map((id) => [id, []]));
  const indegree = new Map([...ids].map((id) => [id, 0]));
  for (const edge of edges) {
    const skillId = Number(edge.skill_id);
    const prerequisiteId = Number(edge.prerequisite_skill_id);
    if (!ids.has(skillId) || !ids.has(prerequisiteId)) continue;
    outgoing.get(prerequisiteId).push(skillId);
    indegree.set(skillId, indegree.get(skillId) + 1);
  }
  const queue = [...ids].filter((id) => indegree.get(id) === 0);
  const ordered = [];
  while (queue.length) {
    const id = queue.shift();
    ordered.push(skills.find((skill) => Number(skill.id) === id));
    for (const next of outgoing.get(id)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  if (ordered.length !== ids.size) {
    const error = new Error('The learning path prerequisite graph contains a cycle.');
    error.statusCode = 422;
    throw error;
  }
  return ordered;
}

export function buildRoadmapPlan({ skills, prerequisites, results, resources, targetDurationDays, availableHours, preferredMethod }) {
  const ordered = topologicalSkills(skills, prerequisites);
  const resultMap = new Map(results.map((item) => [Number(item.skill_id), item]));
  const requiredMinutes = [];
  for (const skill of ordered) {
    const result = resultMap.get(Number(skill.id));
    const score = Number(result?.score || 0);
    const evidence = Number(result?.evidence_count || 0);
    const assessed = result?.assessed === true || result?.assessed === 'true';
    const mastery = assessed && evidence >= MIN_EVIDENCE && score >= 80;
    const minutes = mastery ? 30 : score >= 60 ? 90 : score >= 40 ? 180 : 300;
    requiredMinutes.push({ skill, score, assessed, mastery, minutes });
  }
  const capacityMinutes = Number(availableHours) * DAY_MINUTES;
  const totalMinutes = requiredMinutes.reduce((sum, item) => sum + item.minutes, 0) + Math.max(60, Math.ceil(requiredMinutes.length / 3) * 60);
  const feasible = totalMinutes <= capacityMinutes;
  const suggestedDays = Math.max(30, Math.ceil(totalMinutes / Math.max(1, capacityMinutes / Math.max(1, targetDurationDays))));
  if (!feasible) {
    const error = new Error(`This plan needs about ${Math.ceil(totalMinutes / 60)} hours, but the selected window provides ${Math.floor(capacityMinutes / 60)} hours. Increase study time or use a longer target of about ${suggestedDays} days.`);
    error.statusCode = 422;
    error.details = { requiredHours: Math.ceil(totalMinutes / 60), availableHours: Number(availableHours), suggestedDurationDays: suggestedDays };
    throw error;
  }
  const dailyMinutes = Math.max(15, capacityMinutes / targetDurationDays);
  let cursor = 1;
  const tasks = requiredMinutes.map((item, index) => {
    const duration = Math.max(15, item.minutes);
    const startDay = Math.floor((cursor - 1) / dailyMinutes) + 1;
    const endDay = Math.max(startDay, Math.ceil((cursor + duration - 1) / dailyMinutes));
    cursor += duration;
    const matchingResources = resources.filter((resource) => Number(resource.skill_id) === Number(item.skill.id)).slice(0, 2);
    return {
      skillId: Number(item.skill.id), title: item.mastery ? `Refresh ${item.skill.name}` : `Build ${item.skill.name}`,
      learningObjective: item.mastery ? `Maintain demonstrated proficiency in ${item.skill.name}.` : `Develop practical ability in ${item.skill.name}.`,
      practiceInstructions: preferredMethod === 'practice' ? `Complete a hands-on exercise applying ${item.skill.name}, then record what you learned.` : `Study the material and complete a short exercise applying ${item.skill.name}.`,
      durationMinutes: duration, startDay, endDay, resources: matchingResources
    };
  });
  const phases = [];
  for (let index = 0; index < tasks.length; index += 3) {
    const phaseTasks = tasks.slice(index, index + 3);
    phases.push({
      title: `Phase ${phases.length + 1}: ${phaseTasks[0].title.replace(/^(Build|Refresh) /, '')}`,
      objective: `Build a connected foundation across ${phaseTasks.map((task) => task.title.replace(/^(Build|Refresh) /, '')).join(', ')}.`,
      startDay: phaseTasks[0].startDay, endDay: phaseTasks.at(-1).endDay,
      estimatedMinutes: phaseTasks.reduce((sum, task) => sum + task.durationMinutes, 0), tasks: phaseTasks
    });
  }
  return { phases, totalMinutes, capacityMinutes, feasible: true };
}
