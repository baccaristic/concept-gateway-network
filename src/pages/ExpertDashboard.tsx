
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {Idea, IdeaStatus, User} from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import {useAuth} from "@/contexts/AuthContext.tsx";
import {expertApi} from "@/services/api.ts";
import {Link} from "react-router-dom";
import {EstimationDialog} from "@/components/EstimationDialog.tsx";

// Mock data


interface EstimationFormValues {
  estimatedPrice: number;
  notes: string;
}

const ExpertDashboard = () => {
  const {user} = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [estimateDialogOpen, setEstimateDialogOpen] = useState(false);
  const [estimationPrice, setEstimationPrice] = useState(50000);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    expertApi.getIdeasToEstimate().then(
        (data) => {
          setIdeas(data)
        }
    )
  }, []);

  // Filter ideas to only show approved but not estimated
  const ideasToEstimate = ideas.filter(idea => 
    idea.status === 'APPROVED' && !idea.estimatedPrice
  );
  
  const estimatedIdeas = ideas.filter(idea => 
    idea.status === 'ESTIMATED' && idea.estimatedPrice
  );

  const handleOpenEstimateDialog = (idea: Idea) => {
    setSelectedIdea(idea);
    setEstimationPrice(50000); // Reset to default
    setEstimateDialogOpen(true);
  };

  const handleSubmitEstimation = (values: EstimationFormValues) => {
    if (!selectedIdea) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the idea with estimation
      const updatedIdeas = ideas.map(idea => 
        idea.id === selectedIdea.id 
          ? { 
              ...idea, 
              status: "ESTIMATED" as IdeaStatus,
              estimatedPrice: values.estimatedPrice,
              updatedAt: new Date().toISOString()
            } 
          : idea
      );
      
      setIdeas(updatedIdeas);
      setEstimateDialogOpen(false);
      setIsLoading(false);
      toast.success("Estimation submitted successfully");
    }, 1000);
  };

  const stats = [
    { 
      title: 'Ideas To Estimate', 
      value: ideasToEstimate.length, 
      icon: <FileText className="h-4 w-4" />, 
      color: 'bg-amber-500' 
    },
    { 
      title: 'Estimated Ideas', 
      value: estimatedIdeas.length, 
      icon: <CheckCircle className="h-4 w-4" />, 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'Avg. Estimation', 
      value: estimatedIdeas.length > 0 
        ? `$${Math.round(estimatedIdeas.reduce((sum, idea) => sum + (idea.estimatedPrice || 0), 0) / estimatedIdeas.length).toLocaleString()}`
        : '$0', 
      icon: <DollarSign className="h-4 w-4" />, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Avg. Response Time', 
      value: '1.5 days', 
      icon: <Clock className="h-4 w-4" />, 
      color: 'bg-purple-500' 
    },
  ];

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
            <h1 className="text-3xl font-bold">Expert Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
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
          
          {/* Ideas Tabs */}
          <Tabs defaultValue="to-estimate" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="to-estimate">
                To Estimate <Badge variant="secondary" className="ml-2">{ideasToEstimate.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="estimated">
                Estimated <Badge variant="secondary" className="ml-2">{estimatedIdeas.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="to-estimate" className="space-y-4">
              {ideasToEstimate.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="rounded-full bg-amber-100 p-3 mb-4">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-medium text-center">No ideas to estimate</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      You have no pending ideas that need estimation.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                ideasToEstimate.map((idea) => (
                  <IdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    onEstimate={() => handleOpenEstimateDialog(idea)}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="estimated" className="space-y-4">
              {estimatedIdeas.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="rounded-full bg-blue-100 p-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-center">No estimated ideas</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      You haven't estimated any ideas yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                estimatedIdeas.map((idea) => (
                  <IdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    isEstimated 
                    onViewDetails={() => {}}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Estimation Dialog */}
      <EstimationDialog
          estimateDialogOpen={estimateDialogOpen}
          setEstimateDialogOpen={setEstimateDialogOpen}
          handleSubmitEstimation={handleSubmitEstimation}
          selectedIdea={selectedIdea}
          isLoading={isLoading}/>
    </Layout>
  );
};

// Idea Card Component
interface IdeaCardProps {
  idea: Idea;
  isEstimated?: boolean;
  onEstimate?: () => void;
  onViewDetails?: () => void;
}

const IdeaCard = ({ idea, isEstimated = false, onEstimate, onViewDetails }: IdeaCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={isEstimated ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                  {isEstimated ? "Estimated" : "Needs Estimation"}
                </Badge>
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
                {isEstimated && idea.estimatedPrice && (
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
                {!isEstimated && onEstimate && (
                  <Button size="sm" onClick={onEstimate}>
                    <DollarSign className="h-4 w-4 mr-1" /> Estimate
                  </Button>
                )}
                {isEstimated && onViewDetails && (
                  <Button variant="outline" size="sm" onClick={onViewDetails}>
                    <Eye className="h-4 w-4 mr-1" /> View Details
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/ideas/${idea.id}`}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertDashboard;
