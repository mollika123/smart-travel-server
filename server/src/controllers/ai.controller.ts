import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { geminiService } from '../services/gemini.service';
import { Trip } from '../models/Trip';

export async function generateItinerary(req: AuthRequest, res: Response) {
  try {
    const { destination, startDate, endDate, budget, travelStyle } = req.body;

    if (!destination || !startDate || !endDate || !travelStyle) {
      return res.status(400).json({ message: 'Missing required trip parameters' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Call Gemini Service
    const itinerary = await geminiService.generateItinerary({
      destination,
      startDate,
      endDate,
      budget: budget || 'moderate',
      travelStyle,
    });

    // Save the trip to MongoDB
    const newTrip = new Trip({
      title: `Adventure in ${destination}`,
      destination,
      startDate,
      endDate,
      budget: budget || 'moderate',
      travelStyle,
      itinerary,
      status: 'upcoming',
      createdBy: req.user.id,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ message: error.message || 'Failed to generate itinerary' });
  }
}
