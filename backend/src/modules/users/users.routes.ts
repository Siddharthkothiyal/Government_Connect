import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const usersController = new UsersController();

router.use(authenticateToken);

router.post('/saved/:schemeId', (req, res) => usersController.saveScheme(req, res));
router.delete('/saved/:schemeId', (req, res) => usersController.unsaveScheme(req, res));
router.get('/saved', (req, res) => usersController.getSavedSchemes(req, res));
router.get('/history', (req, res) => usersController.getSearchHistory(req, res));

export default router;
