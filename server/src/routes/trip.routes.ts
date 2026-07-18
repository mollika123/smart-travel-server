import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip } from '../controllers/trip.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all trip routes
router.use(authMiddleware);

// /api/trips
router.post('/', createTrip);
router.get('/', getTrips);

// /api/trips/:id
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
