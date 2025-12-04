import { NextResponse } from 'next/server';

/**
 * API route for chat functionality
 * This is a placeholder for future backend integration
 * Currently returns a mock response
 */
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual AI/backend integration
    // This is a mock response for development
    const mockResponse = `Thank you for your question: "${message}". This is a placeholder response. The backend integration will be added here.`;

    return NextResponse.json({
      message: mockResponse,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

