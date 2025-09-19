
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithAssistant, type ChatMessage } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Hi there! I'm your friendly LifeBoost assistant. How are you feeling today?" }] },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatWithAssistant({ history: newMessages });
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: result.response }] };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Failed to get chat response", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Sorry, I couldn\'t get a response. Please try again.',
      });
       setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 lg:bottom-6 right-6 z-50">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            className="rounded-full h-16 w-16 shadow-lg overflow-hidden p-0"
            aria-label="Open chat"
          >
            {isOpen ? <X className="h-8 w-8" /> : (
                <Image 
                    src="https://img.freepik.com/free-vector/cute-robot-holding-heart-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated_138676-5086.jpg"
                    alt="Chatbot assistant icon"
                    width={64}
                    height={64}
                    className="object-cover"
                    data-ai-hint="friendly robot"
                />
            )}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-44 lg:bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm"
          >
            <div className="bg-card border shadow-xl rounded-lg flex flex-col h-[60vh]">
              <header className="p-4 border-b">
                <h3 className="font-bold text-lg text-card-foreground">LifeBoost Assistant</h3>
                <p className="text-sm text-muted-foreground">I'm here to listen and help.</p>
              </header>
              <ScrollArea className="flex-1" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                      {msg.role === 'model' && (
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                         <div className="prose prose-sm dark:prose-invert max-w-none text-current">
                            <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                         </div>
                      </div>
                       {msg.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                     <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                        </div>
                     </div>
                  )}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-4 border-t flex items-start gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 resize-none bg-background focus-visible:ring-1"
                  rows={1}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          handleSendMessage(e);
                      }
                  }}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
