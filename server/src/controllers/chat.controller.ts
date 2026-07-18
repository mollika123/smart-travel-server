import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { Trip } from '../models/Trip';
import { geminiService } from '../services/gemini.service';

export async function getChatHistory(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const messages = await Message.find({ tripId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}

export async function sendChatMessage(req: AuthRequest, res: Response) {
  try {
    const { tripId, text } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!tripId || !text) {
      return res.status(400).json({ message: 'Missing tripId or text message' });
    }

    // 1. Fetch trip context
    const trip = await Trip.findOne({ _id: tripId, createdBy: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip context not found' });
    }

    // 2. Fetch past messages for history
    const pastMessages = await Message.find({ tripId }).sort({ timestamp: 1 });
    
    // Map to role structure Gemini expects
    const geminiHistory = pastMessages.map((msg) => ({
      role: msg.sender === 'user' ? ('user' as const) : ('model' as const),
      text: msg.text,
    }));

    // 3. Save User message to DB
    const userMessage = new Message({
      tripId,
      sender: 'user',
      text,
    });
    await userMessage.save();

    // 4. Generate AI response
    const aiResponse = await geminiService.generateChatReply(trip, geminiHistory, text);

    // 5. Save AI message to DB
    const aiMessage = new Message({
      tripId,
      sender: 'ai',
      text: aiResponse,
    });
    await aiMessage.save();

    res.status(201).json({
      userMessage,
      aiMessage,
    });
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}
