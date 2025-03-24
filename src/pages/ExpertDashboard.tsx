
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Idea, User } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Eye,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

// Mock data
const mockUser: User = {
  id: '123',
  name: 'Jane Expert',
  email: 'jane.expert@example.com',
  role: 'expert',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Food Waste Reduction System',
    description: 'A system that uses AI to track and reduce food waste in restaurants and homes. The system would use computer vision to identify food items and their quantity, track their use-by dates, and suggest recipes or donation opportunities for items approaching expiration.',
    createdAt: '2023-08-15T10:30:00Z',
    updatedAt: '2023-08-15T10:30:00Z',
    owner_id: '1',
    status: 'approved',
    category: 'Sustainability',
    tags: ['AI', 'Food', 'Sustainability', 'Computer Vision'],
  },
  {
    id: '2',
    title: 'Eco-Friendly Packaging Solution',
    description: 'Biodegradable packaging made from agricultural waste that can replace plastic packaging for food and consumer goods. This innovative solution uses a proprietary process to convert rice husks, corn stalks, and other agricultural byproducts into durable, water-resistant packaging.',
    createdAt: '2023-09-20T14:15:00Z',
    updatedAt: '2023-09-25T09:45:00Z',
    owner_id: '2',
    status: 'approved',
    category: 'Sustainability',
    tags: ['Eco-friendly', 'Packaging', 'Waste Reduction', 'Biodegradable'],
  },
  {
    id: '3',
    title: 'AR Learning Platform for Students',
    description: 'Augmented Reality platform that makes learning interactive and engaging for K-12 students. The platform allows teachers to create immersive learning experiences across various subjects, from biology to history, enhancing student engagement and knowledge retention.',
    createdAt: '2023-10-05T11:20:00Z',
    updatedAt: '2023-10-06T11:20:00Z',
    owner_id: '3',
    status: 'approved',
    category: 'Education',
    tags: ['AR', 'Education', 'Technology', 'Learning'],
  },
  {
    id: '4',
    title: 'Smart Water Conservation System',
    description: 'IoT-based water management system for residential and commercial buildings that monitors usage patterns, detects leaks, and optimizes water consumption. The system uses machine learning to provide personalized recommendations for reducing water waste.',
    createdAt: '2023-11-12T09:10:00Z',
    updatedAt: '2023-11-15T16:30:00Z',
    owner_id: '4',
    status: 'approved',
    category: 'Sustainability',
    tags: ['IoT', 'Water Conservation', 'Smart Home', 'Sustainability'],
  },
  {
    id: '5',
    title: 'Community-Based Mental Health Platform',
    description: 'A mobile platform that connects individuals with peer support groups and licensed therapists within their community. The platform uses a proprietary matching algorithm to connect users with the most suitable support resources based on their needs and preferences.',
    createdAt: '2023-12-03T13:45:00Z',
    updatedAt: '2023-12-05T10:20:00Z',
    owner_id: '5',
    status: 'estimated',
    estimatedPrice: 65000,
    category: 'Healthcare',
    tags: ['Mental Health', 'Community', 'Healthcare', 'Mobile App'],
  },
];

interface EstimationFormValues {
  estimatedPrice: number;
  notes: string;
}

const ExpertDashboard = () => {
  const [user] = useState(mockUser);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [estimateDialogOpen, setEstimateDialogOpen] = useState(false);
  const [estimationPrice, setEstimationPrice] = useState(50000);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<EstimationFormValues>({
    defaultValues: {
      estimatedPrice: 50000,
      notes: '',
    },
  });

  // Filter ideas to only show approved but not estimated
  const ideasToEstimate = ideas.filter(idea => 
    idea.status === 'approved' && !idea.estimatedPrice
  );
  
  const estimatedIdeas = ideas.filter(idea => 
    idea.status === 'estimated' && idea.estimatedPrice
  );

  const handleOpenEstimateDialog = (idea: Idea) => {
    setSelectedIdea(idea);
    setEstimationPrice(50000); // Reset to default
    form.reset({
      estimatedPrice: 50000,
      notes: '',
    });
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
              status: 'estimated' as 'estimated', 
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
      <Dialog open={estimateDialogOpen} onOpenChange={setEstimateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Estimate Idea Price</DialogTitle>
            <DialogDescription>
              {selectedIdea?.title}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitEstimation)} className="space-y-6">
              <FormField
                control={form.control}
                name="estimatedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Development Cost</FormLabel>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">$10,000</span>
                        <span className="text-xl font-bold">${field.value.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">$200,000</span>
                      </div>
                      <Slider
                        defaultValue={[field.value]}
                        min={10000}
                        max={200000}
                        step={5000}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </div>
                    <FormDescription>
                      Provide your best estimate for the development cost of this idea.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimation Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add additional context to your estimation..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes will be shared with the idea owner and admin.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEstimateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Estimation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Download Brief
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
