
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, User, Loader } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput, history: messages }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from server.');
        }
        
        const data = await response.json();

        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: data.text,
            };
            return newMessages;
          });

      } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => {
           const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: "Sorry, I'm having trouble connecting. Please try again later.",
            };
            return newMessages;
        });
      }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm"
          >
            <Card className="flex flex-col h-[60vh] shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline flex items-center gap-2">
                  <Bot /> Vincent Designs Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
                <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                          <Bot size={20} />
                        </div>
                      )}
                      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-muted' : 'bg-card border'}`}>
                        <p className="text-sm">{msg.content || <Loader className="animate-spin" size={20}/>}</p>
                      </div>
                      {msg.role === 'user' && (
                         <div className="bg-muted p-2 rounded-full">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                </ScrollArea>
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question..."
                    disabled={isPending}
                  />
                  <Button onClick={handleSend} disabled={isPending}>
                    {isPending ? <Loader className="animate-spin" /> : <Send />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 h-14 w-14 rounded-full shadow-lg z-50"
        aria-label="Toggle Chat Assistant"
      >
        {isOpen ? <X /> : <Bot />}
      </Button>
    </>
  );
}
