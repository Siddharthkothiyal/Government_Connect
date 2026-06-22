import { Router } from 'express';
import { AIController } from './ai.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const aiController = new AIController();

router.post('/explain', (req, res) => aiController.explainScheme(req, res));

export default router;
