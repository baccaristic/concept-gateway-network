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

  const addExpert = async (expertData: { name: string, email: string, password: string }) => {
    setIsLoading(true);
    try {
      const newExpert = await adminApi.addExpert(expertData);
      toast.success('Expert added successfully');
      return newExpert;
    } catch (error) {
      toast.error(`Error adding expert: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllExperts = async () => {
    setIsLoading(true);
    try {
      const experts = await adminApi.getAllExperts();
      return experts;
    } catch (error) {
      toast.error(`Error fetching experts: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const assignIdeaToExpert = async (ideaId: string, expertId: string) => {
    setIsLoading(true);
    try {
      await adminApi.assignIdeaToExpert(ideaId, expertId);
      toast.success('Idea assigned to expert successfully');
    } catch (error) {
      toast.error(`Error assigning idea to expert: ${error.message}`);
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

  const getIdeaById = async (ideaId: string) => {
    setIsLoading(true);
    try {
      const idea = await adminApi.getIdeaById(ideaId);
      return idea;
    } catch (error) {
      toast.error(`Error fetching idea details: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getAllUsers,
    updateUserRole,
    addExpert,
    getAllExperts,
    assignIdeaToExpert,
    getAllIdeas,
    updateIdeaStatus,
    deleteIdea,
    getDashboardStats,
    getIdeaById
  };
}
