import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {User} from "@/types";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      setIsLoading(true);
      const rep = await fetch('http://localhost:8083/auth/register', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({email, password,name,role})
      });
      if (rep.ok) {
        toast.success('Registration successful! Please check your email for confirmation.');
        navigate('/login');
      }
      else {
        const response = await rep.text();
        toast.error(`Error signing up: ${response}`);
      }
    } catch (error){
      toast.error(`Error signing up: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const rep = await fetch('http://localhost:8083/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
      });
      if (rep.ok) {
        rep.json().then((data) => {
          localStorage.setItem("token", data.token);
          setUser(data.user);
          navigate('/dashboard');
        })
      }
      else {
        const response = await rep.text();
        toast.error(`Error signing in: ${response}`)
      }
    } catch (error) {
      toast.error(`Error signing in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/');
    } catch (error) {
      toast.error(`Error signing out: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error(`Error sending reset password email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error(`Error updating password: ${error.message}`);
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
