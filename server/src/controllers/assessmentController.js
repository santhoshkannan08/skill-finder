import { createAssessmentSchema, answerSchema } from '../validators/assessmentValidator.js';
import * as service from '../services/assessmentService.js';

const validate = (schema, value) => { const parsed = schema.safeParse(value); if (!parsed.success) { const error = new Error(parsed.error.issues[0].message); error.statusCode = 400; throw error; } return parsed.data; };
export async function create(req, res) { res.status(201).json({ assessment: await service.createAssessment(req.user.id, validate(createAssessmentSchema, req.body)) }); }
export async function list(req, res) { res.json({ assessments: await service.listAssessments(req.user.id) }); }
export async function questions(req, res) { const data = await service.getQuestions(req.user.id, req.params.assessmentId); if (!data) return res.status(404).json({ error: { message: 'Assessment not found' } }); res.json(data); }
export async function answer(req, res) { const data = await service.saveAnswer(req.user.id, req.params.assessmentId, req.params.questionId, validate(answerSchema, req.body)); if (!data) return res.status(404).json({ error: { message: 'Assessment not found' } }); res.json({ answer: data }); }
export async function submit(req, res) { const result = await service.submitAssessment(req.user.id, req.params.assessmentId); if (!result) return res.status(404).json({ error: { message: 'Assessment not found' } }); res.json({ results: result }); }
export async function results(req, res) { const result = await service.getResults(req.user.id, req.params.assessmentId); if (!result) return res.status(404).json({ error: { message: 'Results not found' } }); res.json({ results: result.summary, submittedAt: result.submitted_at }); }
