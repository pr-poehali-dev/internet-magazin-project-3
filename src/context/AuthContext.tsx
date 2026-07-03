import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem } from '@/context/CartContext';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Оформлен' | 'В обработке' | 'Отправлен' | 'Доставлен';
}

export interface User {
  name: string;
  email: string;
  orders: Order[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (email: string, name: string) => {
    setUser({ name: name || email.split('@')[0], email, orders: [] });
  };

  const logout = () => setUser(null);

  const addOrder = (order: Order) => {
    setUser((prev) =>
      prev ? { ...prev, orders: [order, ...prev.orders] } : prev
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
