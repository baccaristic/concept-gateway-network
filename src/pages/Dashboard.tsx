
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserRole, Idea } from '@/types';
import {useAuth} from "@/contexts/AuthContext.tsx";

const Dashboard = () => {
  const {user} = useAuth()
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {

    fetch('http://localhost:8083/ideas/my-ideas', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    }).then(
        (response) => {
          response.json().then(
              (ideas) => {
                console.log(ideas);
                setIdeas(ideas)
              }
          )
        }
    )
  }, []);

  // Stats based on the user role
  const renderStats = () => {
    switch (user.role) {
      case 'IDEA_HOLDER':
        return [
          { title: 'My Ideas', value: ideas.length, icon: <FileText className="h-4 w-4" />, color: 'bg-blue-500' },
          { title: 'Approved', value: ideas.filter(i => i.status === 'APPROVED').length, icon: <CheckCircle className="h-4 w-4" />, color: 'bg-emerald-500' },
          { title: 'Pending', value: ideas.filter(i => i.status === 'AWAITING_APPROVAL').length, icon: <Clock className="h-4 w-4" />, color: 'bg-amber-500' },
          { title: 'Estimated Value', value: `$${ideas.reduce((sum, idea) => sum + (idea.estimatedPrice || 0), 0).toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: 'bg-indigo-500' },
        ];
      case 'EXPERT':
        return [
          { title: 'To Estimate', value: 12, icon: <FileText className="h-4 w-4" />, color: 'bg-blue-500' },
          { title: 'Estimated', value: 45, icon: <CheckCircle className="h-4 w-4" />, color: 'bg-emerald-500' },
          { title: 'Avg. Estimation', value: '$32,150', icon: <DollarSign className="h-4 w-4" />, color: 'bg-indigo-500' },
          { title: 'Response Time', value: '1.5 days', icon: <Clock className="h-4 w-4" />, color: 'bg-amber-500' },
        ];
      case 'ADMIN':
        return [
          { title: 'Total Ideas', value: 157, icon: <FileText className="h-4 w-4" />, color: 'bg-blue-500' },
          { title: 'Total Users', value: 83, icon: <Users className="h-4 w-4" />, color: 'bg-purple-500' },
          { title: 'Pending Approval', value: 23, icon: <Clock className="h-4 w-4" />, color: 'bg-amber-500' },
          { title: 'Revenue', value: '$45,750', icon: <DollarSign className="h-4 w-4" />, color: 'bg-emerald-500' },
        ];
      case 'INVESTOR':
        return [
          { title: 'Viewed Ideas', value: 34, icon: <Eye className="h-4 w-4" />, color: 'bg-blue-500' },
          { title: 'Signed Agreements', value: 12, icon: <FileText className="h-4 w-4" />, color: 'bg-emerald-500' },
          { title: 'Investment Budget', value: '$150,000', icon: <DollarSign className="h-4 w-4" />, color: 'bg-indigo-500' },
          { title: 'Invested', value: '$75,000', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-purple-500' },
        ];
      default:
        return [];
    }
  };

  // Render different content based on user role
  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'IDEA_HOLDER':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Ideas</h2>
              <Button asChild>
                <Link to="/submit-idea">
                  <Plus className="mr-2 h-4 w-4" /> New Idea
                </Link>
              </Button>
            </div>
            
            {ideas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                    You haven't submitted any ideas yet. Start by creating your first idea.
                  </p>
                  <Button asChild>
                    <Link to="/submit-idea">
                      <Plus className="mr-2 h-4 w-4" /> Submit your first idea
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="estimated">Estimated</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {ideas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} userRole={user.role} />
                  ))}
                </TabsContent>
                
                <TabsContent value="pending" className="space-y-4">
                  {ideas.filter(idea => idea.status === 'AWAITING_APPROVAL').map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} userRole={user.role} />
                  ))}
                </TabsContent>
                
                <TabsContent value="approved" className="space-y-4">
                  {ideas.filter(idea => idea.status === 'APPROVED').map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} userRole={user.role} />
                  ))}
                </TabsContent>
                
                <TabsContent value="estimated" className="space-y-4">
                  {ideas.filter(idea => idea.status === 'ESTIMATED').map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} userRole={user.role} />
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </div>
        );
        
      // Other role-specific content would go here
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <p>Role-specific dashboard under development.</p>
          </div>
        );
    }
  };

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderStats().map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} text-white p-2 rounded-md`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {renderRoleSpecificContent()}
        </motion.div>
      </div>
    </Layout>
  );
};

// Idea Card Component
interface IdeaCardProps {
  idea: Idea;
  userRole: UserRole;
}

const IdeaCard = ({ idea, userRole }: IdeaCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'estimated':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Estimated</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                {getStatusBadge(idea.status)}
                {idea.category && (
                  <Badge variant="secondary">{idea.category}</Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold">{idea.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{idea.description}</p>
              {idea.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end justify-between gap-4">
              <div className="text-right">
                {idea.estimatedPrice && (
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-1 text-emerald-500" />
                    <span>${idea.estimatedPrice.toLocaleString()}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(idea.updatedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/ideas/${idea.id}`}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Link>
                </Button>
                {userRole === 'IDEA_HOLDER' && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
