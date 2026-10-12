import { evidenceSchema, quizSubmissionSchema } from '../validators/skillProofValidator.js';
import * as service from '../services/skillProofService.js';
const parse = (schema, value) => { const result = schema.safeParse(value); if (!result.success) { const error = new Error(result.error.issues[0].message); error.statusCode = 400; throw error; } return result.data; };
export async function quiz(req, res) { res.json({ quiz: await service.getQuiz(req.user.id, req.params.taskId) }); }
export async function submitQuiz(req, res) { res.status(201).json({ attempt: await service.submitQuiz(req.user.id, req.params.taskId, parse(quizSubmissionSchema, req.body).answers) }); }
export async function createEvidence(req, res) { res.status(201).json({ evidence: await service.submitEvidence(req.user.id, parse(evidenceSchema, req.body)) }); }
export async function evidence(req, res) { res.json({ evidence: await service.listEvidence(req.user.id) }); }
export async function evidenceDetail(req, res) { res.json({ evidence: await service.getEvidence(req.user.id, req.params.evidenceId) }); }
