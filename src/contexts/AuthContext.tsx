
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from "@/types";
import { authApi, userApi } from "@/services/api";
import { useTranslation } from 'react-i18next';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      setIsLoading(true);
      await authApi.register(email, password, name, role);
      toast.success(t('auth.registrationSuccess'));
      navigate('/login');
    } catch (error) {
      toast.error(`${t('auth.registrationError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authApi.login(email, password);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      toast.error(`${t('auth.loginError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (error) {
      toast.error(`${t('auth.logoutError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // Implement reset password functionality with your API
      toast.success(t('auth.resetPasswordSuccess'));
    } catch (error) {
      toast.error(`${t('auth.resetPasswordError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      // Implement update password functionality with your API
      toast.success(t('auth.passwordUpdateSuccess'));
      navigate('/login');
    } catch (error) {
      toast.error(`${t('auth.passwordUpdateError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
