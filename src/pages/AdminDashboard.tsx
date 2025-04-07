
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Idea, User, UserRole, IdeaStatus } from '@/types';
import { useAdminService } from '@/hooks/useAdminService';
import { AddExpertModal } from '@/components/admin/AddExpertModal';
import { DashboardStatCards } from '@/components/admin/DashboardStatCards';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import { IdeasManagementTable } from '@/components/admin/IdeasManagementTable';
import { UsersManagementTable } from '@/components/admin/UsersManagementTable';
import { ContentManagement } from '@/components/admin/ContentManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminService = useAdminService();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    userCount: 0,
    ideaCount: 0,
    expertCount: 0,
    investorCount: 0,
    ideaHolderCount: 0,
    adminCount: 0,
    statusCounts: {} as Record<string, number>
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddExpertModal, setShowAddExpertModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get all dashboard data
        const [ideasData, usersData, statsData] = await Promise.all([
          adminService.getAllIdeas(),
          adminService.getAllUsers(),
          adminService.getDashboardStats()
        ]);
        
        setIdeas(ideasData);
        setUsers(usersData);
        setStats(statsData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
    } catch (error) {
      console.error('Error updating user role:', error.message);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.deleteIdea(ideaId);
      
      // Update local state
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
      setStats(prev => ({
        ...prev,
        ideaCount: prev.ideaCount - 1
      }));
      
    } catch (error) {
      console.error('Error deleting idea:', error.message);
    }
  };

  const handleUpdateIdeaStatus = async (ideaId: string, newStatus: IdeaStatus) => {
    try {
      await adminService.updateIdeaStatus(ideaId, newStatus);
      
      // Update local state
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => idea.id === ideaId ? { ...idea, status: newStatus } : idea)
      );
      
    } catch (error) {
      console.error('Error updating idea status:', error.message);
    }
  };

  const handleExpertAdded = async () => {
    try {
      // Refresh users list
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
      
      // Refresh stats
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error refreshing data after adding expert:', error);
    }
  };

  // Chart data for user roles
  const roleData = [
    { name: 'Idea Holders', value: stats.ideaHolderCount, color: '#10b981' },
    { name: 'Experts', value: stats.expertCount, color: '#3b82f6' },
    { name: 'Investors', value: stats.investorCount, color: '#8b5cf6' },
    { name: 'Admins', value: stats.adminCount, color: '#ef4444' },
  ];

  // Chart data for idea status
  const statusData = Object.entries(stats.statusCounts || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    count,
  }));

  if (!user || (user && user.role !== 'ADMIN')) {
    return (
      <Layout user={user ?? undefined}>
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user ?? undefined}>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <DashboardStatCards stats={stats} />
        
        <DashboardCharts roleData={roleData} statusData={statusData} />
        
        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="ideas">Manage Ideas</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="content">Manage Homepage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas">
            <IdeasManagementTable 
              ideas={ideas} 
              onUpdateStatus={handleUpdateIdeaStatus} 
              onDeleteIdea={handleDeleteIdea} 
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManagementTable 
              users={users} 
              onUpdateUserRole={handleUpdateUserRole} 
              onShowAddExpertModal={() => setShowAddExpertModal(true)} 
            />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
        </Tabs>
      </div>
      
      <AddExpertModal 
        isOpen={showAddExpertModal} 
        onClose={() => setShowAddExpertModal(false)}
        onExpertAdded={handleExpertAdded}
      />
    </Layout>
  );
};

export default AdminDashboard;
