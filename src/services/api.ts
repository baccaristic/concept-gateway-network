/**
 * API service for handling all backend communication
 */
import { Idea, User, Comment, UserRole, IdeaStatus, Agreement, IdeaAdditionalData, Attachment } from "@/types";

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

  getEstimatedIdeas: async (): Promise<Idea[]> => {
    const response = await fetch(`${API_BASE_URL}/ideas/estimated`, {
      headers: setAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ideas');
    }

    return await response.json();
  },
  getInvestorEstimatedIdeas: async (): Promise<Idea[]> => {
    const response = await fetch(`${API_BASE_URL}/ideas/investor/estimated`, {
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
    estimatedBudget?: number;
    additionalData?: IdeaAdditionalData;
  }): Promise<Idea> => {
    // Make sure we're using camelCase for all fields
    const payload = {
      ...ideaData,
      // Convert any remaining snake_case fields to camelCase if necessary
    };
    
    const response = await fetch(`${API_BASE_URL}/ideas/new`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify(payload)
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
  },
  
  likeIdea: async (ideaId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/like`, {
      method: 'POST',
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to like idea');
    }
  },
  
  uploadAttachment: async (ideaId: string, file: File, description?: string): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description || '');
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload attachment');
    }
    
    return await response.json();
  },
  
  submitEstimation: async (ideaId: string, estimationData: { price: number, notes: string }): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/idea/expert/estimate`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify({
        ideaId,
        price: estimationData.price,
        notes: estimationData.notes
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit estimation');
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
  },

  updateProfile: async (profileData: { name: string, email: string, avatarUrl?: string }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: setAuthHeader(),
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update profile');
    }
    
    return await response.json();
  },

  updatePassword: async (passwordData: { currentPassword: string, newPassword: string }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: setAuthHeader(),
      body: JSON.stringify(passwordData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update password');
    }
    
    return;
  },

  updateAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update avatar');
    }
    
    return await response.json();
  }
};

export const expertApi = {
  getIdeasToEstimate: async (): Promise<Idea[]> => {
    const response = await fetch(`${API_BASE_URL}/ideas/estimate`, {
      headers: setAuthHeader()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch ideas to estimate');
    }
    return await response.json();
  },
  
  submitEstimation: async (ideaId: string, price: number, notes: string): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/idea/expert/estimate`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify({
        ideaId,
        price,
        notes
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit estimation');
    }
    
    return await response.json();
  }
}

/**
 * Investor related API calls
 */
export const investorApi = {
  // Get agreements by investor
  getMyAgreements: async (): Promise<Agreement[]> => {
    const response = await fetch(`${API_BASE_URL}/investor/agreements`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch agreements');
    }
    
    return await response.json();
  },
  
  // Get agreement by ID
  getAgreementById: async (agreementId: string): Promise<Agreement> => {
    const response = await fetch(`${API_BASE_URL}/investor/agreements/${agreementId}`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch agreement');
    }
    
    return await response.json();
  },
  
  // Create a new agreement
  createAgreement: async (ideaId: string): Promise<Agreement> => {
    const response = await fetch(`${API_BASE_URL}/investor/agreements`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify({ ideaId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create agreement');
    }
    
    return await response.json();
  },
  
  // Submit signed agreement document
  submitSignedAgreement: async (agreementId: string, signatureData: string, file?: File): Promise<Agreement> => {
    const formData = new FormData();
    formData.append('agreementId', agreementId);
    formData.append('signatureData', signatureData);
    
    if (file) {
      formData.append('file', file);
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/investor/agreements/${agreementId}/sign`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit signed agreement');
    }
    
    return await response.json();
  }
};

/**
 * Admin related API calls
 */
export const adminApi = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return await response.json();
  },
  
  // Update user role (admin only)
  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: setAuthHeader(),
      body: JSON.stringify({ role })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user role');
    }
    
    return await response.json();
  },
  
  // Add a new expert (admin only)
  addExpert: async (expertData: { name: string, email: string, password: string }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/experts`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify(expertData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add expert');
    }
    
    return await response.json();
  },
  
  // Get all ideas (admin only)
  getAllIdeas: async (): Promise<Idea[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/ideas`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch ideas');
    }
    
    return await response.json();
  },
  
  // Get idea by ID (admin & authorized users)
  getIdeaById: async (ideaId: string): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch idea details');
    }
    
    return await response.json();
  },
  
  // Update idea status (admin only)
  updateIdeaStatus: async (ideaId: string, status: IdeaStatus): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/admin/ideas/${ideaId}/status`, {
      method: 'PUT',
      headers: setAuthHeader(),
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update idea status');
    }
    
    return await response.json();
  },
  
  // Delete idea (admin only)
  deleteIdea: async (ideaId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/ideas/${ideaId}`, {
      method: 'DELETE',
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete idea');
    }
  },
  
  // Get dashboard stats (admin only)
  getDashboardStats: async (): Promise<{
    userCount: number;
    ideaCount: number;
    expertCount: number;
    investorCount: number;
    ideaHolderCount: number;
    adminCount: number;
    statusCounts: Record<string, number>;
  }> => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return await response.json();
  },
  
  // Get all expert users
  getAllExperts: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/experts`, {
      headers: setAuthHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch experts');
    }
    
    return await response.json();
  },
  
  // Assign idea to expert
  assignIdeaToExpert: async (ideaId: string, expertId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/assign`, {
      method: 'POST',
      headers: setAuthHeader(),
      body: JSON.stringify({ ideaId, expertId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to assign idea to expert');
    }
  }
};
