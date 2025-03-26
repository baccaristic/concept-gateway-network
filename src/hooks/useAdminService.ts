
import { useState } from 'react';
import { adminApi } from '@/services/api';
import { Idea, User, UserRole, IdeaStatus } from '@/types';
import { toast } from 'sonner';

export function useAdminService() {
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const users = await adminApi.getAllUsers();
      return users;
    } catch (error) {
      toast.error(`Error fetching users: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const updatedUser = await adminApi.updateUserRole(userId, role);
      toast.success(`User role updated to ${role}`);
      return updatedUser;
    } catch (error) {
      toast.error(`Error updating user role: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllIdeas = async () => {
    setIsLoading(true);
    try {
      const ideas = await adminApi.getAllIdeas();
      return ideas;
    } catch (error) {
      toast.error(`Error fetching ideas: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIdeaStatus = async (ideaId: string, status: IdeaStatus) => {
    setIsLoading(true);
    try {
      const updatedIdea = await adminApi.updateIdeaStatus(ideaId, status);
      toast.success(`Idea status updated to ${status}`);
      return updatedIdea;
    } catch (error) {
      toast.error(`Error updating idea status: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    setIsLoading(true);
    try {
      await adminApi.deleteIdea(ideaId);
      toast.success('Idea deleted successfully');
    } catch (error) {
      toast.error(`Error deleting idea: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardStats = async () => {
    setIsLoading(true);
    try {
      const stats = await adminApi.getDashboardStats();
      return stats;
    } catch (error) {
      toast.error(`Error fetching dashboard stats: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getAllUsers,
    updateUserRole,
    getAllIdeas,
    updateIdeaStatus,
    deleteIdea,
    getDashboardStats
  };
}
