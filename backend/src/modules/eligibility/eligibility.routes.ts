import { Router } from 'express';
import { EligibilityController } from './eligibility.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const eligibilityController = new EligibilityController();

router.post('/', (req, res) => eligibilityController.checkEligibility(req, res));

export default router;
