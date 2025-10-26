
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { answerQuestion } from '../services/geminiService';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface ChatProps {
  transcript: string;
}

const Chat: React.FC<ChatProps> = ({ transcript }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerQuestion(transcript, input, messages);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'model' && <BotIcon />}
            <div className={`rounded-lg px-4 py-2 max-w-sm ${message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              <p className="text-sm">{message.content}</p>
            </div>
             {message.role === 'user' && <UserIcon />}
          </div>
        ))}
        {isLoading && (
           <div className="flex items-start gap-3">
             <BotIcon />
             <div className="rounded-lg px-4 py-2 max-w-sm bg-gray-700 text-gray-300">
                <LoaderIcon className="animate-spin h-5 w-5" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about the story..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-indigo-900 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
