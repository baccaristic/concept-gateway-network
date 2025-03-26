
/**
 * API service for handling all backend communication
 */
import { Idea, User, Comment } from "@/types";

// Base API URL - change this to your Spring Boot server address in production
const API_BASE_URL = 'http://localhost:8083';

/**
 * Set authentication token for API requests
 * @param token JWT token from authentication
 */
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * Authentication related API calls
 */
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to login');
    }
    
    return await response.json();
  },
  
  register: async (email: string, password: string, name: string, role: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name, role })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to register');
    }
    
    return await response.json();
  }
};

/**
 * Ideas related API calls
 */
export const ideasApi = {
  getMyIdeas: async (): Promise<Idea[]> => {
    const response = await fetch(`${API_BASE_URL}/ideas/my-ideas`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch ideas');
    }
    
    return await response.json();
  },
  
  submitIdea: async (ideaData: {
    title: string;
    description: string;
    category?: string;
    estimated_budget?: number;
  }): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas/new`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify(ideaData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit idea');
    }
    
    return await response.json();
  },
  
  getIdeaById: async (id: string): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch idea details');
    }
    
    return await response.json();
  },
  
  addComment: async (ideaId: string, comment: { text: string }): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/comments`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify(comment)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    
    return await response.json();
  }
};

/**
 * User related API calls
 */
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return await response.json();
  }
};
