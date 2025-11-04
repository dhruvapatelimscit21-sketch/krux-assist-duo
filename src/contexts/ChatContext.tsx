import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type MessageSender = 'user' | 'bot' | 'agent';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Message {
  id: string;
  ticketId: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  notes?: string;
}

interface ChatState {
  tickets: Ticket[];
  activeTicketId: string | null;
}

type ChatAction =
  | { type: 'CREATE_TICKET'; payload: Ticket }
  | { type: 'ADD_MESSAGE'; payload: { ticketId: string; message: Message } }
  | { type: 'UPDATE_TICKET'; payload: { ticketId: string; updates: Partial<Ticket> } }
  | { type: 'SET_ACTIVE_TICKET'; payload: string | null }
  | { type: 'LOAD_TICKETS'; payload: Ticket[] };

const ChatContext = createContext<{
  state: ChatState;
  createTicket: (ticket: Ticket) => void;
  addMessage: (ticketId: string, message: Message) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  setActiveTicket: (ticketId: string | null) => void;
  getTicketById: (ticketId: string) => Ticket | undefined;
} | undefined>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'CREATE_TICKET':
      return {
        ...state,
        tickets: [...state.tickets, action.payload],
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? {
                ...ticket,
                messages: [...ticket.messages, action.payload.message],
                updatedAt: new Date(),
              }
            : ticket
        ),
      };
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? { ...ticket, ...action.payload.updates, updatedAt: new Date() }
            : ticket
        ),
      };
    case 'SET_ACTIVE_TICKET':
      return {
        ...state,
        activeTicketId: action.payload,
      };
    case 'LOAD_TICKETS':
      return {
        ...state,
        tickets: action.payload,
      };
    default:
      return state;
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    tickets: [],
    activeTicketId: null,
  });

  useEffect(() => {
    // Load tickets from localStorage
    const savedTickets = localStorage.getItem('krux_tickets');
    if (savedTickets) {
      const tickets = JSON.parse(savedTickets, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
      dispatch({ type: 'LOAD_TICKETS', payload: tickets });
    }
  }, []);

  useEffect(() => {
    // Save tickets to localStorage
    if (state.tickets.length > 0) {
      localStorage.setItem('krux_tickets', JSON.stringify(state.tickets));
    }
  }, [state.tickets]);

  const createTicket = (ticket: Ticket) => {
    dispatch({ type: 'CREATE_TICKET', payload: ticket });
  };

  const addMessage = (ticketId: string, message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId, message } });
  };

  const updateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    dispatch({ type: 'UPDATE_TICKET', payload: { ticketId, updates } });
  };

  const setActiveTicket = (ticketId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_TICKET', payload: ticketId });
  };

  const getTicketById = (ticketId: string) => {
    return state.tickets.find(t => t.id === ticketId);
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        createTicket,
        addMessage,
        updateTicket,
        setActiveTicket,
        getTicketById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
