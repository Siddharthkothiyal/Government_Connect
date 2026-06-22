import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticateToken, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authenticateToken, requireAdmin);

router.post('/schemes', (req, res) => adminController.createScheme(req, res));
router.put('/schemes/:id', (req, res) => adminController.updateScheme(req, res));
router.delete('/schemes/:id', (req, res) => adminController.deleteScheme(req, res));

router.post('/rules', (req, res) => adminController.createEligibilityRule(req, res));
router.put('/rules/:id', (req, res) => adminController.updateEligibilityRule(req, res));
router.delete('/rules/:id', (req, res) => adminController.deleteEligibilityRule(req, res));

export default router;
