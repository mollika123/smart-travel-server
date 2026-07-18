import { getGenerativeModel } from '../config/gemini';

export interface ItineraryGenerationParams {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'moderate' | 'luxury';
  travelStyle: string;
}

export const geminiService = {
  /**
   * Generates a structured JSON itinerary using Gemini
   */
  generateItinerary: async (params: ItineraryGenerationParams) => {
    try {
      const model = getGenerativeModel('gemini-1.5-flash');
      
      const durationDays = Math.ceil(
        (new Date(params.endDate).getTime() - new Date(params.startDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      ) + 1;

      const prompt = `
        You are an expert travel planner. Create a highly detailed, personalized daily travel itinerary.
        
        Trip Details:
        - Destination: ${params.destination}
        - Duration: ${durationDays} days
        - Budget level: ${params.budget}
        - Travel Style: ${params.travelStyle}

        Please return ONLY a JSON array matching this schema:
        [
          {
            "dayNumber": number,
            "activities": [
              {
                "time": "HH:MM AM/PM",
                "title": "Name of Activity",
                "description": "Short details about what to do, what to expect, and food/sightseeing tips.",
                "location": "Optional address or site name",
                "cost": "Estimated price range (e.g. Free, $10-$20)"
              }
            ]
          }
        ]
        Do not add any markdown headers, formatting, or extra text. Return strictly valid raw JSON.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean up potential markdown formatting wrapping the JSON
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Error in geminiService.generateItinerary:', error);
      throw new Error('Failed to generate itinerary from AI service');
    }
  },

  /**
   * Generates a chat assistant response based on itinerary context
   */
  generateChatReply: async (
    tripContext: any,
    chatHistory: { role: 'user' | 'model'; text: string }[],
    newMessage: string
  ) => {
    try {
      const model = getGenerativeModel('gemini-1.5-flash');

      const systemInstruction = `
        You are a friendly, highly helpful travel assistant guide for SmartTravel.
        The user is discussing a trip to ${tripContext?.destination || 'their destination'}.
        
        Trip Context:
        - Dates: ${tripContext?.startDate} to ${tripContext?.endDate}
        - Travel Style: ${tripContext?.travelStyle}
        - Budget: ${tripContext?.budget}
        
        Keep answers helpful, concise, and focused on suggestions, tips, packing items, or routing questions.
      `;

      // Structure history for the chat model
      const chat = model.startChat({
        history: chatHistory.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        systemInstruction
      });

      const result = await chat.sendMessage(newMessage);
      return result.response.text();
    } catch (error) {
      console.error('Error in geminiService.generateChatReply:', error);
      throw new Error('Failed to fetch reply from AI travel assistant');
    }
  }
};
export default geminiService;
