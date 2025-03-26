
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Idea, User, UserRole, IdeaStatus } from '@/types';
import { useAdminService } from '@/hooks/useAdminService';
import { AddExpertModal } from '@/components/admin/AddExpertModal';
import { UserPlus } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
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

  // Filter ideas based on search term
  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (idea.category && idea.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.userCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.ideaCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Experts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.expertCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.investorCount}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Roles Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [value, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Idea Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="ideas">Manage Ideas</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas">
            <Card>
              <CardHeader>
                <CardTitle>Ideas Management</CardTitle>
                <CardDescription>View and manage all ideas in the platform</CardDescription>
                <div className="mt-4">
                  <Input
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIdeas.map((idea) => (
                        <TableRow key={idea.id}>
                          <TableCell>{idea.title}</TableCell>
                          <TableCell>
                            <Badge variant={
                              idea.status === 'APPROVED' ? 'default' :
                              idea.status === 'AWAITING_APPROVAL' ? 'secondary' :
                              idea.status === 'ESTIMATED' ? 'destructive' :
                              'outline'
                            }>
                              {idea.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{idea.category || '-'}</TableCell>
                          <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Select
                                defaultValue={idea.status}
                                onValueChange={(value) => handleUpdateIdeaStatus(idea.id, value as IdeaStatus)}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AWAITING_APPROVAL">Awaiting Approval</SelectItem>
                                  <SelectItem value="APPROVED">Approved</SelectItem>
                                  <SelectItem value="ESTIMATED">Estimated</SelectItem>
                                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/ideas/${idea.id}`)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteIdea(idea.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Users Management</CardTitle>
                  <CardDescription>View and manage all users in the platform</CardDescription>
                </div>
                <Button 
                  className="flex items-center gap-1"
                  onClick={() => setShowAddExpertModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Expert
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.role === 'ADMIN' ? 'destructive' :
                              user.role === 'EXPERT' ? 'default' :
                              user.role === 'INVESTOR' ? 'secondary' :
                              'outline'
                            }>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Select
                                defaultValue={user.role}
                                onValueChange={(value: UserRole) => handleUpdateUserRole(user.id, value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Change role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="IDEA_HOLDER">Idea Holder</SelectItem>
                                  <SelectItem value="EXPERT">Expert</SelectItem>
                                  <SelectItem value="INVESTOR">Investor</SelectItem>
                                  <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
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
