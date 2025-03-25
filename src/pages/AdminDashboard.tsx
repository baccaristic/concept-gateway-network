import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Idea, User, UserRole } from '@/types';

const AdminDashboard = () => {
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [ideaCount, setIdeaCount] = useState(0);
  const [expertCount, setExpertCount] = useState(0);
  const [investorCount, setInvestorCount] = useState(0);
  const [ideaHolderCount, setIdeaHolderCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch ideas
        const { data: ideasData, error: ideasError } = await supabase
          .from('ideas')
          .select('*');
          
        if (ideasError) throw ideasError;
        
        // Transform the data to match our Idea interface
        const formattedIdeas = ideasData.map(idea => ({
          id: idea.id,
          title: idea.title,
          description: idea.description,
          category: idea.category || undefined,
          status: idea.status,
          createdAt: idea.created_at,
          updatedAt: idea.updated_at || undefined,
          owner_id: idea.owner_id || undefined,
          estimatedBudget: idea.estimated_budget || undefined,
          estimatedPrice: idea.estimated_price || undefined,
          views: idea.views || undefined,
          likes: idea.likes || undefined,
        }));
        
        setIdeas(formattedIdeas);
        setIdeaCount(formattedIdeas.length);
        
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*');
          
        if (usersError) throw usersError;
        
        const formattedUsers = usersData.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          avatarUrl: user.avatar_url || undefined,
        }));
        
        setUsers(formattedUsers);
        setUserCount(formattedUsers.length);
        setExpertCount(formattedUsers.filter(user => user.role === 'EXPERT').length);
        setInvestorCount(formattedUsers.filter(user => user.role === 'INVESTOR').length);
        setIdeaHolderCount(formattedUsers.filter(user => user.role === 'IDEA_HOLDER').length);
        setAdminCount(formattedUsers.filter(user => user.role === 'ADMIN').length);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
      
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error.message);
      toast.error('Failed to update user role');
    }
  };

  const deleteIdea = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;
      
      // Update local state
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
      setIdeaCount(prevCount => prevCount - 1);
      
      toast.success('Idea deleted successfully');
    } catch (error) {
      console.error('Error deleting idea:', error.message);
      toast.error('Failed to delete idea');
    }
  };

  const updateIdeaStatus = async (ideaId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ status: newStatus })
        .eq('id', ideaId);

      if (error) throw error;
      
      // Update local state
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => idea.id === ideaId ? { ...idea, status: newStatus } : idea)
      );
      
      toast.success(`Idea status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating idea status:', error.message);
      toast.error('Failed to update idea status');
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
    { name: 'Idea Holders', value: ideaHolderCount, color: '#10b981' },
    { name: 'Experts', value: expertCount, color: '#3b82f6' },
    { name: 'Investors', value: investorCount, color: '#8b5cf6' },
    { name: 'Admins', value: adminCount, color: '#ef4444' },
  ];

  // Chart data for idea status
  const statusCounts = ideas.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
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
              <p className="text-3xl font-bold">{userCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{ideaCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Experts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{expertCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{investorCount}</p>
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
                  <Tooltip formatter={(value) => [value, 'Count']} />
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
                  <Tooltip />
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
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIdeas.map((idea) => (
                        <tr key={idea.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{idea.title}</td>
                          <td className="px-4 py-2">
                            <Badge variant={
                              idea.status === 'APPROVED' ? 'default' :
                              idea.status === 'AWAITING_APPROVAL' ? 'secondary' :
                              idea.status === 'ESTIMATED' ? 'destructive' :
                              'outline'
                            }>
                              {idea.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">{idea.category || '-'}</td>
                          <td className="px-4 py-2">{new Date(idea.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Select
                                defaultValue={idea.status}
                                onValueChange={(value) => updateIdeaStatus(idea.id, value)}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
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
                                onClick={() => deleteIdea(idea.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>View and manage all users in the platform</CardDescription>
                <div className="mt-4">
                  <Input
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <Badge variant={
                              user.role === 'ADMIN' ? 'destructive' :
                              user.role === 'EXPERT' ? 'default' :
                              user.role === 'INVESTOR' ? 'secondary' :
                              'outline'
                            }>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Select
                                defaultValue={user.role}
                                onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Change role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="idea-holder">Idea Holder</SelectItem>
                                  <SelectItem value="expert">Expert</SelectItem>
                                  <SelectItem value="investor">Investor</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
