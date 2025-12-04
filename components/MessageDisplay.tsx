import type { Message } from '@/types';

interface MessageDisplayProps {
  messages: Message[];
}

export default function MessageDisplay({ messages }: MessageDisplayProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Start a conversation by asking a question
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <p
              className={`text-xs mt-2 ${
                message.role === 'user'
                  ? 'text-blue-100'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

