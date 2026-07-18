import { Router } from 'express';
import { getChatHistory, sendChatMessage } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// /api/chat/history/:tripId
router.get('/history/:tripId', getChatHistory);

// /api/chat/message
router.post('/message', sendChatMessage);

export default router;
