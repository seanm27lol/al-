
import { GoogleGenAI, Type } from '@google/genai';
import type { Analysis, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    bias: {
      type: Type.OBJECT,
      properties: {
        score: {
          type: Type.INTEGER,
          description: 'A score from -10 (very left-leaning) to 10 (very right-leaning), with 0 being neutral.',
        },
        summary: {
          type: Type.STRING,
          description: 'A brief summary explaining the bias assessment.',
        },
      },
      required: ['score', 'summary'],
    },
    perspective: {
      type: Type.STRING,
      description: 'A concise summary of the main perspective or angle of the news report.',
    },
    claims: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim: {
            type: Type.STRING,
            description: 'A specific, verifiable claim made in the transcript.',
          },
          verification: {
            type: Type.STRING,
            description: 'The verification status of the claim. Must be one of: "Verified", "Unverified", "Misleading".',
          },
          reasoning: {
            type: Type.STRING,
            description: 'A brief explanation for the verification status.'
          }
        },
        required: ['claim', 'verification', 'reasoning'],
      },
    },
  },
  required: ['bias', 'perspective', 'claims'],
};

export async function analyzeStory(transcript: string): Promise<Analysis> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Analyze the following news transcript for bias, perspective, and factual claims. Be objective and concise. Here is the transcript: "${transcript}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    // Basic type checking to ensure the parsed object matches the Analysis interface
    if (result && typeof result.bias?.score === 'number' && Array.isArray(result.claims)) {
      return result as Analysis;
    } else {
      throw new Error("Parsed JSON does not match the expected Analysis structure.");
    }

  } catch (error) {
    console.error('Error analyzing story with Gemini:', error);
    throw new Error('Failed to analyze story. Please try again.');
  }
}

export async function answerQuestion(transcript: string, question: string, history: ChatMessage[]): Promise<string> {
  try {
     const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a helpful AI assistant for Aletheia News. Your task is to answer user questions based *only* on the provided news transcript. If the answer cannot be found in the transcript, state that clearly. Do not use outside knowledge. Here is the transcript: "${transcript}"`,
        },
     });

    const historyForApi = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    
    // This is a simplified way to handle history. In a real app, you'd integrate it more deeply.
    if (historyForApi.length > 0) {
        // Not using the native history object here to have more control for the prompt context
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `System instruction: You are a helpful AI assistant for Aletheia News. Your task is to answer user questions based *only* on the provided news transcript. If the answer cannot be found in the transcript, state that clearly. Do not use outside knowledge. Here is the transcript: "${transcript}".
            
            Previous conversation:
            ${history.map(m => `${m.role}: ${m.content}`).join('\n')}
            
            New user question: "${question}"
            `
        });
        return response.text;
    }

    const response = await chat.sendMessage({ message: question });
    return response.text;

  } catch (error) {
    console.error('Error getting answer from Gemini:', error);
    throw new Error('Failed to get an answer. Please try again.');
  }
}
