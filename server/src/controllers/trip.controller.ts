import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Trip } from '../models/Trip';

export async function createTrip(req: AuthRequest, res: Response) {
  try {
    const { title, destination, startDate, endDate, budget, travelStyle, itinerary } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newTrip = new Trip({
      title: title || `Trip to ${destination}`,
      destination,
      startDate,
      endDate,
      budget,
      travelStyle,
      itinerary: itinerary || [],
      createdBy: req.user.id,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}

export async function getTrips(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const trips = await Trip.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}

export async function getTripById(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const trip = await Trip.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}

export async function updateTrip(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    res.json(updatedTrip);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}

export async function deleteTrip(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const deletedTrip = await Trip.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}
