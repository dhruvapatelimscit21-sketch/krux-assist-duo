import { Ticket } from '@/contexts/ChatContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  isActive: boolean;
  onClick: () => void;
}

const TicketCard = ({ ticket, isActive, onClick }: TicketCardProps) => {
  const getPriorityColor = () => {
    switch (ticket.priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = () => {
    switch (ticket.status) {
      case 'resolved': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-info text-info-foreground';
      case 'escalated': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const lastMessage = ticket.messages[ticket.messages.length - 1];
  const timeAgo = () => {
    const diff = Date.now() - new Date(ticket.updatedAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md border-l-4',
        isActive ? 'bg-accent/50 border-l-accent' : 'border-l-transparent'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{ticket.customerName}</h3>
            {ticket.priority === 'urgent' && <AlertCircle className="w-4 h-4 text-destructive" />}
          </div>
          <p className="text-xs text-muted-foreground">{ticket.id}</p>
        </div>
        <Badge className={cn('text-xs', getPriorityColor())}>
          {ticket.priority}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {lastMessage?.content || 'No messages yet'}
      </p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          {timeAgo()}
        </div>
        <Badge variant="outline" className={getStatusColor()}>
          {ticket.status}
        </Badge>
      </div>

      {ticket.assignedAgent && (
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          {ticket.assignedAgent}
        </div>
      )}
    </Card>
  );
};

export default TicketCard;
