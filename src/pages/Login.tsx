import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, MOCK_CUSTOMERS, MOCK_AGENTS } from '@/contexts/AuthContext';
import { Building2, UserCircle } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as 'customer' | 'agent' || 'customer';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credential, setCredential] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'customer') {
      const customer = MOCK_CUSTOMERS.find(c => c.phone === credential);
      if (customer) {
        login(customer);
        navigate('/customer-chat');
      } else {
        alert('Invalid phone number. Try: +919876543210 or +919876543211');
      }
    } else {
      const agent = MOCK_AGENTS.find(a => a.username === credential);
      if (agent) {
        login(agent);
        navigate('/support-dashboard');
      } else {
        alert('Invalid username. Try: amit.kumar or sneha.singh');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            {role === 'customer' ? (
              <UserCircle className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Building2 className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {role === 'customer' ? 'Customer Login' : 'Agent Login'}
          </CardTitle>
          <CardDescription>
            {role === 'customer'
              ? 'Enter your registered phone number'
              : 'Enter your agent username'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={role === 'customer' ? '+91XXXXXXXXXX' : 'username'}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Demo Credentials:</p>
              {role === 'customer' ? (
                <div className="space-y-1 text-muted-foreground">
                  <p>• +919876543210 (Rahul Sharma)</p>
                  <p>• +919876543211 (Priya Patel)</p>
                </div>
              ) : (
                <div className="space-y-1 text-muted-foreground">
                  <p>• amit.kumar (Support Agent)</p>
                  <p>• sneha.singh (Senior Agent)</p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
