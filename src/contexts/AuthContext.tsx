import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type UserRole = 'customer' | 'agent';

export interface User {
  id: string;
  name: string;
  phone?: string;
  username?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const AuthContext = createContext<{
  state: AuthState;
  login: (user: User) => void;
  logout: () => void;
} | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Mock users
export const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Rahul Sharma', phone: '+919876543210', role: 'customer' as UserRole },
  { id: 'c2', name: 'Priya Patel', phone: '+919876543211', role: 'customer' as UserRole },
];

export const MOCK_AGENTS = [
  { id: 'a1', name: 'Amit Kumar', username: 'amit.kumar', role: 'agent' as UserRole },
  { id: 'a2', name: 'Sneha Singh', username: 'sneha.singh', role: 'agent' as UserRole },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('krux_user');
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });
    }
  }, []);

  const login = (user: User) => {
    localStorage.setItem('krux_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('krux_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
