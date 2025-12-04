export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

