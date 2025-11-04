import { Message, MessageSender } from '@/contexts/ChatContext';
import { Bot, User, Headset } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const isAgent = message.sender === 'agent';

  const getIcon = () => {
    if (isBot) return <Bot className="w-4 h-4" />;
    if (isAgent) return <Headset className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const getBgColor = () => {
    if (isUser) return 'bg-chat-user text-chat-user-foreground';
    if (isAgent) return 'bg-chat-agent text-chat-agent-foreground';
    return 'bg-chat-bot text-chat-bot-foreground border border-border';
  };

  return (
    <div className={cn('flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-chat-user' : isAgent ? 'bg-chat-agent' : 'bg-muted'
      )}>
        <span className="text-white">{getIcon()}</span>
      </div>
      
      <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start', 'max-w-[75%]')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5 shadow-sm',
          getBgColor(),
          isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'
        )}>
          {!isUser && (
            <p className="text-xs font-medium mb-1 opacity-80">{message.senderName}</p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
