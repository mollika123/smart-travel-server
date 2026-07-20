import { Router } from 'express';
import { 
  createTrip, 
  getTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip 
} from '../controllers/trip.controller';

import { authMiddleware } from '../middleware/auth';

const router = Router();


// Public route (আগে)
router.get('/:id', getTripById);

router.get('/', getTrips);
// Protected routes
router.post('/', authMiddleware, createTrip);



router.put('/:id', authMiddleware, updateTrip);

router.delete('/:id', authMiddleware, deleteTrip);


export default router;