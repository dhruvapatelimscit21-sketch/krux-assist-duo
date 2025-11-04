import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Message } from '@/contexts/ChatContext';
import { LogOut, Search, Send, CheckCircle, AlertTriangle, ArrowUpCircle, Building2 } from 'lucide-react';
import TicketCard from '@/components/dashboard/TicketCard';
import ChatMessage from '@/components/chat/ChatMessage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const { state: authState, logout } = useAuth();
  const { state: chatState, addMessage, updateTicket, setActiveTicket } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'agent') {
      navigate('/login?role=agent');
      return;
    }
  }, [authState, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.activeTicketId, chatState.tickets]);

  const activeTicket = chatState.tickets.find(t => t.id === chatState.activeTicketId);

  const filteredTickets = chatState.tickets.filter(ticket => {
    const query = searchQuery.toLowerCase();
    const matchesBasicInfo = 
      ticket.customerName.toLowerCase().includes(query) ||
      ticket.id.toLowerCase().includes(query) ||
      ticket.customerPhone.includes(query);
    
    const matchesMessages = ticket.messages.some(msg => 
      msg.content.toLowerCase().includes(query)
    );
    
    return matchesBasicInfo || matchesMessages;
  });

  const handleSendReply = () => {
    if (!replyMessage.trim() || !activeTicket) return;

    const agentMsg: Message = {
      id: `msg-${Date.now()}`,
      ticketId: activeTicket.id,
      sender: 'agent',
      senderName: authState.user!.name,
      content: replyMessage,
      timestamp: new Date(),
    };

    addMessage(activeTicket.id, agentMsg);
    updateTicket(activeTicket.id, { 
      status: 'in-progress',
      assignedAgent: authState.user!.name 
    });
    setReplyMessage('');
  };

  const handleUpdateStatus = (status: string) => {
    if (!activeTicket) return;
    updateTicket(activeTicket.id, { status: status as any });
  };

  const handleUpdatePriority = (priority: string) => {
    if (!activeTicket) return;
    updateTicket(activeTicket.id, { priority: priority as any });
  };

  const handleSaveNotes = () => {
    if (!activeTicket) return;
    updateTicket(activeTicket.id, { notes: agentNotes });
  };

  const quickReplies = [
    "Thank you for contacting KRUX Finance. How can I help you today?",
    "I'll need to check your application details. Please hold on for a moment.",
    "Your application is currently under review. We'll update you within 24 hours.",
    "Could you please provide your Application ID for faster assistance?",
    "I've escalated your request to our senior team. They'll contact you shortly.",
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl">KRUX Finance</h1>
              <p className="text-sm opacity-90">Support Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Agent: {authState.user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/20">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Ticket Queue Sidebar */}
        <aside className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground">
              All Tickets ({filteredTickets.length})
            </h2>
            {filteredTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tickets found
              </p>
            ) : (
              filteredTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isActive={ticket.id === chatState.activeTicketId}
                  onClick={() => setActiveTicket(ticket.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTicket ? (
            <>
              {/* Ticket Header */}
              <div className="border-b bg-card px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{activeTicket.customerName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {activeTicket.customerPhone} • {activeTicket.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={activeTicket.status} onValueChange={handleUpdateStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={activeTicket.priority} onValueChange={handleUpdatePriority}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {activeTicket.messages.map(msg => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-6 py-2 border-t bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick Replies:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyMessage(reply)}
                      className="whitespace-nowrap text-xs"
                    >
                      {reply.substring(0, 40)}...
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reply Input */}
              <div className="border-t bg-card px-6 py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!replyMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-96">
                <CardHeader className="text-center">
                  <CardTitle>Select a Ticket</CardTitle>
                  <CardDescription>
                    Choose a ticket from the queue to start assisting the customer
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </main>

        {/* Customer Info Sidebar */}
        {activeTicket && (
          <aside className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{activeTicket.customerName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{activeTicket.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium">{activeTicket.category}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Internal Notes</h3>
                <Textarea
                  placeholder="Add private notes about this ticket..."
                  value={agentNotes || activeTicket.notes || ''}
                  onChange={(e) => setAgentNotes(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleSaveNotes} size="sm" className="mt-2 w-full">
                  Save Notes
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleUpdateStatus('resolved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleUpdateStatus('escalated')}
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Escalate Ticket
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleUpdatePriority('urgent')}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Mark as Urgent
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
