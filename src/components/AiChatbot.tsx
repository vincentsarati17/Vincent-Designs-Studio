
'use client';

import { runAssistantFlow } from '@/ai/flows/assistant-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, Send, User, X } from 'lucide-react';
import { useState, useRef, useEffect, useTransition } from 'react';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getGreeting = async () => {
    const { response } = await runAssistantFlow({
      prompt: "Introduce yourself briefly. You are the Vincent Designs Studio assistant.",
    });
    setMessages([{ role: 'model', content: response }]);
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startTransition(async () => {
        await getGreeting();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.querySelector('[data-viewport]')?.scrollTo({
        top: scrollAreaRef.current.querySelector('[data-viewport]')?.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isPending]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));

      const { response } = await runAssistantFlow({
        history: chatHistory,
        prompt: currentInput,
      });

      setMessages((prev) => [...prev, { role: 'model', content: response }]);
    });
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        <span className="sr-only">Toggle Chatbot</span>
      </Button>

      {isOpen && (
        <Card className="fixed bottom-40 right-6 w-80 h-[28rem] flex flex-col shadow-xl z-50 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-headline text-lg">Vincent Designs Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : ''
                    )}
                  >
                    {message.role === 'model' && (
                      <div className="p-2 bg-primary rounded-full text-primary-foreground">
                        <Bot size={16} />
                      </div>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-lg max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-card text-card-foreground border'
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                      <div className="p-2 bg-muted rounded-full text-muted-foreground">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                ))}
                 {isPending && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary rounded-full text-primary-foreground">
                          <Bot size={16} />
                      </div>
                      <div className="p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-2">
                              <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                              <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                              <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                          </div>
                      </div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1"
                  disabled={isPending}
                />
                <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
