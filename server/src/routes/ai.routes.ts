import { Router } from 'express';
import { generateItinerary } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all AI generation routes
router.use(authMiddleware);

// /api/ai/generate
router.post('/generate', generateItinerary);

export default router;
