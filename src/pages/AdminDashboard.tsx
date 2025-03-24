
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Idea, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Trash2, Users, FileText, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        navigate('/dashboard');
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await checkAdmin();
        
        // Fetch ideas
        const { data: ideasData, error: ideasError } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false });

        if (ideasError) throw ideasError;
        
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;
        
        setIdeas(ideasData || []);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteIdea = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this idea?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setIdeas(ideas.filter(idea => idea.id !== id));
      toast.success('Idea deleted successfully');
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
    }
  };

  const handleUpdateUserRole = async (userId: string, currentRole: string) => {
    const roles: string[] = ['idea-holder', 'investor', 'expert', 'admin'];
    const currentIndex = roles.indexOf(currentRole);
    const newRole = roles[(currentIndex + 1) % roles.length];

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'estimated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatistics = () => {
    return {
      totalIdeas: ideas.length,
      pendingIdeas: ideas.filter(idea => idea.status === 'pending').length,
      approvedIdeas: ideas.filter(idea => idea.status === 'approved').length,
      rejectedIdeas: ideas.filter(idea => idea.status === 'rejected').length,
      estimatedIdeas: ideas.filter(idea => idea.status === 'estimated').length,
      totalUsers: users.length,
      ideaHolders: users.filter(user => user.role === 'idea-holder').length,
      investors: users.filter(user => user.role === 'investor').length,
      experts: users.filter(user => user.role === 'expert').length,
      admins: users.filter(user => user.role === 'admin').length,
    };
  };

  const stats = getStatistics();

  return (
    <Layout user={user ? { name: user.user_metadata?.name || 'Admin', role: 'admin' } : undefined}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    {stats.totalIdeas}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    {stats.totalUsers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingIdeas}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.estimatedIdeas}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Idea Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Pending</span>
                      <span className="font-semibold">{stats.pendingIdeas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approved</span>
                      <span className="font-semibold">{stats.approvedIdeas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rejected</span>
                      <span className="font-semibold">{stats.rejectedIdeas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Estimated</span>
                      <span className="font-semibold">{stats.estimatedIdeas}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Role Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Idea Holders</span>
                      <span className="font-semibold">{stats.ideaHolders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Investors</span>
                      <span className="font-semibold">{stats.investors}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Experts</span>
                      <span className="font-semibold">{stats.experts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Admins</span>
                      <span className="font-semibold">{stats.admins}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ideas">
            <Card>
              <CardHeader>
                <CardTitle>All Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Estimated Price</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ideas.length > 0 ? (
                        ideas.map((idea) => (
                          <TableRow key={idea.id}>
                            <TableCell className="font-medium">{idea.title}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(idea.status)}`}>
                                {idea.status}
                              </span>
                            </TableCell>
                            <TableCell>{idea.category || 'N/A'}</TableCell>
                            <TableCell>{idea.estimatedPrice ? `$${idea.estimatedPrice.toLocaleString()}` : 'Not estimated'}</TableCell>
                            <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/ideas/${idea.id}`)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteIdea(idea.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">No ideas found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize cursor-pointer" 
                                     onClick={() => handleUpdateUserRole(user.id, user.role)}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleUpdateUserRole(user.id, user.role)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">No users found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
