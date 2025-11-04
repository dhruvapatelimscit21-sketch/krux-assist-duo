import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MessageSquare, Headset, ArrowRight, Shield, Zap, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/20 mb-6">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">KRUX Finance</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-2">Customer Support System</p>
          <p className="text-sm opacity-75 max-w-2xl mx-auto">
            Dual chatbot system for seamless customer service and support management
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with local data persistence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Instant Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered bot with seamless agent escalation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Efficient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive dashboard for support teams
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Portal */}
          <Card className="border-2 hover:border-accent transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Customer Chat</CardTitle>
              <CardDescription className="text-base">
                Get instant help with loan applications and queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Apply for loans (Business, Personal, MSME)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Check application status
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Get document requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Connect with support agents
                </li>
              </ul>
              <Link to="/login?role=customer" className="block">
                <Button className="w-full" size="lg">
                  Start Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Agent Dashboard */}
          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Headset className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Support Dashboard</CardTitle>
              <CardDescription className="text-base">
                Manage customer conversations and support tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  View and manage ticket queue
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Real-time customer chat
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Quick reply templates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Track and resolve tickets
                </li>
              </ul>
              <Link to="/login?role=agent" className="block">
                <Button className="w-full" variant="outline" size="lg">
                  Agent Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 KRUX Finance. Tech Intern Assessment Project.</p>
          <p className="mt-2">Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
