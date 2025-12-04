import type { ChatResponse, ApiError } from '@/types';

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/62ae67ed-67b4-4fa7-b2ec-188d28470775';

/**
 * Sends a message to the AI customer support API
 * @param message - The user's message/question
 * @returns Promise with the AI response
 */
export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: message }),
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return {
      message: data.message || data.response || data.answer || JSON.stringify(data) || 'No response received',
      success: true,
    };
  } catch (error) {
    const apiError: ApiError = error instanceof Error
      ? { message: error.message }
      : { message: 'An unknown error occurred' };

    return {
      message: apiError.message,
      success: false,
      error: apiError.message,
    };
  }
}

/**
 * Generates a unique ID for messages
 */
export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

