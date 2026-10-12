import { Router } from 'express';
import { requireAuth, csrfProtection } from '../middleware/auth.js';
import { create, list, questions, answer, submit, results, careerRecommendations } from '../controllers/assessmentController.js';

const router = Router();
router.use(requireAuth);
router.post('/', csrfProtection, create);
router.get('/', list);
router.get('/:assessmentId/questions', questions);
router.put('/:assessmentId/answers/:questionId', csrfProtection, answer);
router.post('/:assessmentId/submit', csrfProtection, submit);
router.get('/:assessmentId/results', results);
router.get('/:assessmentId/career-recommendations', careerRecommendations);

export default router;
