import { Router } from 'express';
import { listFieldPaths, listFieldQuestions, listFields, listPathSkills, listPaths } from '../controllers/catalogController.js';

const router = Router();
router.get('/fields', listFields);
router.get('/fields/:fieldId/paths', listFieldPaths);
router.get('/fields/:fieldId/questions', listFieldQuestions);
router.get('/paths', listPaths);
router.get('/paths/:pathId/skills', listPathSkills);

export default router;
