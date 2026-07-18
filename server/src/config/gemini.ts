import { GoogleGenerativeAI  } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not defined in the environment variables.');
}

export const ai = apiKey ? new GoogleGenerativeAI( apiKey ) : null;
export const getGenerativeModel = (modelName = 'gemini-1.5-flash') => {
  if (!ai) {
    throw new Error('Gemini API is not initialized. Please verify your GEMINI_API_KEY.');
  }
  return ai.getGenerativeModel({ model: modelName });
};
