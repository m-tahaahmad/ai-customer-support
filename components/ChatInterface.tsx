'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import type { Message } from '@/types';
import { sendMessage, generateMessageId } from '@/lib/api';
import Input from './Input';
import Button from './Button';
import MessageDisplay from './MessageDisplay';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage.content);
      
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: response.success
          ? response.message
          : 'Sorry, I encountered an error. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(),
        content: 'Sorry, I encountered an error. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 px-4 py-6">
        <MessageDisplay messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your question here..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading} disabled={!inputValue.trim()}>
          Ask AI
        </Button>
      </form>
    </div>
  );
}

