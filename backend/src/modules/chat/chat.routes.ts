import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const chatController = new ChatController();

router.post('/', (req, res) => chatController.chat(req, res));

export default router;
