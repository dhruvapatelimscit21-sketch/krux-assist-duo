import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Message, Ticket } from '@/contexts/ChatContext';
import { getBotResponse } from '@/utils/botResponses';
import ChatMessage from '@/components/chat/ChatMessage';
import QuickReplies from '@/components/chat/QuickReplies';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { Send, LogOut, Building2 } from 'lucide-react';

const CustomerChat = () => {
  const navigate = useNavigate();
  const { state: authState, logout } = useAuth();
  const { state: chatState, createTicket, addMessage, setActiveTicket } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'customer') {
      navigate('/login?role=customer');
      return;
    }

    // Find or create ticket for this customer
    const existingTicket = chatState.tickets.find(
      t => t.customerId === authState.user!.id && t.status !== 'resolved'
    );

    if (existingTicket) {
      setCurrentTicket(existingTicket);
      setActiveTicket(existingTicket.id);
    } else {
      // Create new ticket
      const newTicket: Ticket = {
        id: `TKT-${Date.now()}`,
        customerId: authState.user!.id,
        customerName: authState.user!.name,
        customerPhone: authState.user!.phone || '',
        status: 'open',
        priority: 'medium',
        category: 'General Inquiry',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      };

      createTicket(newTicket);
      setCurrentTicket(newTicket);
      setActiveTicket(newTicket.id);

      // Send welcome message
      setTimeout(() => {
        const welcomeMsg: Message = {
          id: `msg-${Date.now()}`,
          ticketId: newTicket.id,
          sender: 'bot',
          senderName: 'KRUX Bot',
          content: 'Hello! Welcome to KRUX Finance. I\'m here to help you with your loan application. How can I assist you today?',
          timestamp: new Date(),
        };
        addMessage(newTicket.id, welcomeMsg);
        setQuickReplies([
          'Apply for a loan',
          'Check application status',
          'Document requirements',
          'Speak to an agent'
        ]);
      }, 500);
    }
  }, [authState, navigate]);

  useEffect(() => {
    // Update current ticket when chat state changes
    if (currentTicket) {
      const updated = chatState.tickets.find(t => t.id === currentTicket.id);
      if (updated) {
        setCurrentTicket(updated);
      }
    }
  }, [chatState.tickets, currentTicket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTicket?.messages, isTyping]);

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || !currentTicket) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      ticketId: currentTicket.id,
      sender: 'user',
      senderName: authState.user!.name,
      content: text,
      timestamp: new Date(),
    };

    addMessage(currentTicket.id, userMsg);
    setInputMessage('');
    setQuickReplies([]);

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      
      if (botResponse.escalate) {
        // Escalate to human agent
        const escalationMsg: Message = {
          id: `msg-${Date.now()}`,
          ticketId: currentTicket.id,
          sender: 'bot',
          senderName: 'KRUX Bot',
          content: botResponse.message,
          timestamp: new Date(),
        };
        addMessage(currentTicket.id, escalationMsg);
        
        // Update ticket to in-progress
        setTimeout(() => {
          const agentMsg: Message = {
            id: `msg-${Date.now() + 1}`,
            ticketId: currentTicket.id,
            sender: 'agent',
            senderName: 'Support Agent',
            content: `Hello ${authState.user!.name}! I'm here to help you. What would you like to know about our loan services?`,
            timestamp: new Date(),
          };
          addMessage(currentTicket.id, agentMsg);
        }, 1500);
      } else {
        const botMsg: Message = {
          id: `msg-${Date.now()}`,
          ticketId: currentTicket.id,
          sender: 'bot',
          senderName: 'KRUX Bot',
          content: botResponse.message,
          timestamp: new Date(),
        };
        addMessage(currentTicket.id, botMsg);
        
        if (botResponse.options) {
          setQuickReplies(botResponse.options);
        }
      }
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentTicket) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">KRUX Finance</h1>
              <p className="text-xs opacity-90">Customer Support</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/20">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
        {currentTicket.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div className="px-4 pb-2 max-w-4xl mx-auto w-full">
          <QuickReplies options={quickReplies} onSelect={handleSendMessage} />
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-card px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 max-w-4xl mx-auto"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomerChat;
