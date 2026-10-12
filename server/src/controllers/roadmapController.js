import { generateRoadmapSchema, updateRoadmapSchema, updateTaskSchema } from '../validators/roadmapValidator.js';
import * as service from '../services/roadmapService.js';
const parse = (schema, value) => { const result = schema.safeParse(value); if (!result.success) { const error = new Error(result.error.issues[0].message); error.statusCode = 400; throw error; } return result.data; };
const notFound = (value, message) => { if (!value) { const error = new Error(message); error.statusCode = 404; throw error; } return value; };
export async function generate(req, res) { res.status(201).json({ roadmap: await service.generateRoadmap(req.user.id, parse(generateRoadmapSchema, req.body)) }); }
export async function list(req, res) { res.json({ roadmaps: await service.listRoadmaps(req.user.id) }); }
export async function get(req, res) { res.json({ roadmap: notFound(await service.getRoadmap(req.user.id, req.params.roadmapId), 'Roadmap not found') }); }
export async function update(req, res) { res.json({ roadmap: notFound(await service.updateRoadmap(req.user.id, req.params.roadmapId, parse(updateRoadmapSchema, req.body)), 'Roadmap not found') }); }
export async function tasks(req, res) { const roadmap = notFound(await service.getRoadmap(req.user.id, req.params.roadmapId), 'Roadmap not found'); res.json({ roadmapId: roadmap.id, phases: roadmap.phases }); }
export async function timeline(req, res) { res.json({ timeline: notFound(await service.getTimeline(req.user.id, req.params.roadmapId), 'Roadmap not found') }); }
export async function taskUpdate(req, res) { res.json({ task: notFound(await service.updateTask(req.user.id, req.params.roadmapId, req.params.taskId, parse(updateTaskSchema, req.body).status), 'Task not found') }); }
