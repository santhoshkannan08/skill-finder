import * as service from '../services/progressService.js';
export async function start(req, res) { res.json({ task: await service.startTask(req.user.id, req.params.taskId) }); }
export async function complete(req, res) { res.json({ task: await service.completeTask(req.user.id, req.params.taskId) }); }
export async function overview(req, res) { res.json(await service.overview(req.user.id)); }
export async function skills(req, res) { res.json({ skills: await service.skills(req.user.id) }); }
