
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Calendar, DollarSign, MessageCircle, ThumbsUp, User, 
  Lightbulb, Users, Globe, Briefcase, PieChart, Award, FileText, 
  Video, Target, CheckCircle, Clock, LineChart, BarChart, CreditCard,
  Heart, Eye, Tag, LucideIcon
} from 'lucide-react';
import { Idea, Comment, MarketEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ideasApi } from '@/services/api';
import { useAdminService } from '@/hooks/useAdminService';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    'APPROVED': { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-300', 
      label: 'Approved'
    },
    'AWAITING_APPROVAL': { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-300',
      label: 'Awaiting Approval'
    },
    'ESTIMATED': { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-800 dark:text-blue-300',
      label: 'Estimated'
    },
    'CONFIRMED': { 
      bg: 'bg-purple-100 dark:bg-purple-900/30', 
      text: 'text-purple-800 dark:text-purple-300',
      label: 'Confirmed'
    }
  };

  const statusStyle = statusMap[status] || { 
    bg: 'bg-gray-100 dark:bg-gray-800', 
    text: 'text-gray-800 dark:text-gray-300',
    label: status
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        statusStyle.bg, 
        statusStyle.text,
        "font-medium"
      )}
    >
      {statusStyle.label}
    </Badge>
  );
};

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  content: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger';
  className?: string;
}

const InfoCard = ({ title, icon: Icon, content, variant = 'default', className }: InfoCardProps) => {
  const variantStyles: Record<string, { header: string; iconColor: string }> = {
    default: { 
      header: 'bg-primary/10 dark:bg-primary/20', 
      iconColor: 'text-primary' 
    },
    primary: { 
      header: 'bg-primary/10 dark:bg-primary/20', 
      iconColor: 'text-primary' 
    },
    success: { 
      header: 'bg-green-50 dark:bg-green-900/20', 
      iconColor: 'text-green-700 dark:text-green-300' 
    },
    warning: { 
      header: 'bg-yellow-50 dark:bg-yellow-900/20', 
      iconColor: 'text-yellow-700 dark:text-yellow-300' 
    },
    info: { 
      header: 'bg-blue-50 dark:bg-blue-900/20', 
      iconColor: 'text-blue-700 dark:text-blue-300' 
    },
    danger: { 
      header: 'bg-red-50 dark:bg-red-900/20', 
      iconColor: 'text-red-700 dark:text-red-300' 
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn("overflow-hidden shadow-sm transition-all hover:shadow-md", className)}>
      <CardHeader className={cn(styles.header, "pb-3")}>
        <CardTitle className="text-lg flex items-center">
          <Icon className={cn("h-5 w-5 mr-2", styles.iconColor)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </CardContent>
    </Card>
  );
};

const IdeaDetails = () => {
  const { ideaId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminService = useAdminService();
  const { theme } = useTheme();
  
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('innovation');

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!ideaId) return;
      
      setLoading(true);
      try {
        let ideaData: Idea;
        
        // Use different API endpoints based on user role
        if (user && user.role === 'ADMIN') {
          ideaData = await adminService.getIdeaById(ideaId);
        } else {
          ideaData = await ideasApi.getIdeaById(ideaId);
        }
        
        setIdea(ideaData);
      } catch (error) {
        console.error('Error fetching idea details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [ideaId, user]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !ideaId) return;
    
    try {
      const newComment = await ideasApi.addComment(ideaId, { text: comment });
      
      // Update local state with the new comment
      if (idea) {
        setIdea({
          ...idea,
          comments: [...(idea.comments || []), newComment]
        });
      }
      
      setComment('');
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const handleLike = async () => {
    if (!idea || !ideaId) return;
    
    try {
      await ideasApi.likeIdea(ideaId);
      
      // Update local state
      setIdea({
        ...idea,
        likes: (idea.likes || 0) + 1
      });
      
      toast.success("Idea liked!");
    } catch (error) {
      console.error('Error liking idea:', error);
      toast.error("Failed to like idea. Please try again.");
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case "ADMIN":
        return "/admin-dashboard";
      case "EXPERT":
        return "/expert-dashboard";
      case "INVESTOR":
        return "/investor-dashboard";
      default:
        return "/dashboard";
    }
  };

  const renderMarketEntries = (markets?: MarketEntry[]) => {
    if (!markets || markets.length === 0) return <p className="text-muted-foreground italic">No market entries</p>;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {markets.map((market, index) => (
          <Card key={index} className="p-3 border shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">
                <Globe className="h-4 w-4 inline mr-1" /> {market.target}
              </span>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{market.country}</span>
                <span>{market.year}</span>
              </div>
              <Badge variant="outline" className="w-fit mt-1">
                {market.marketType}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="space-y-4 w-full max-w-3xl mx-auto">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!idea) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Idea Not Found</h2>
            <p className="mb-6 text-muted-foreground">The idea you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user ?? undefined}>
      <div className="container py-8">
        <Link to={getDashboardLink()} className="flex items-center text-primary hover:underline mb-6 group transition-all">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <Card className="border shadow-md mb-8 overflow-hidden">
          <div className="relative">
            {/* Decorative header gradient */}
            <div className="absolute inset-0 h-24 bg-gradient-to-r from-primary/30 to-primary/10" />
            
            <CardHeader className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">{idea.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    Submitted {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={idea.status} />
                  {idea.category && (
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {idea.category}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="space-y-6 pt-0">
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${idea.submitterName || 'User'}`} />
                <AvatarFallback>{(idea.submitterName || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{idea.submitterName || 'Unknown User'}</p>
                <p className="text-sm text-muted-foreground">Idea Creator</p>
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                Description
              </h3>
              <p className="text-card-foreground whitespace-pre-line">{idea.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {idea.estimatedBudget && (
                <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg">
                  <DollarSign className="h-12 w-12 mr-4 opacity-80" />
                  <div>
                    <span className="block text-sm">Estimated Budget</span>
                    <span className="text-xl font-bold">${idea.estimatedBudget.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-6">
                <div className="flex flex-col items-center bg-muted p-4 rounded-lg flex-1">
                  <Eye className="h-6 w-6 mb-1 text-muted-foreground" />
                  <span className="text-lg font-semibold">{idea.views || 0}</span>
                  <span className="text-xs text-muted-foreground">Views</span>
                </div>
                
                <div className="flex flex-col items-center bg-muted p-4 rounded-lg flex-1">
                  <Heart 
                    className="h-6 w-6 mb-1 text-red-500 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={handleLike}
                  />
                  <span className="text-lg font-semibold">{idea.likes || 0}</span>
                  <span className="text-xs text-muted-foreground">Likes</span>
                </div>
                
                <div className="flex flex-col items-center bg-muted p-4 rounded-lg flex-1">
                  <MessageCircle className="h-6 w-6 mb-1 text-muted-foreground" />
                  <span className="text-lg font-semibold">{idea.comments?.length || 0}</span>
                  <span className="text-xs text-muted-foreground">Comments</span>
                </div>
              </div>
            </div>

            {idea.additionalData?.sector && (
              <div className="flex flex-wrap gap-3 bg-muted/50 p-3 rounded-md">
                {idea.additionalData.sector && (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{idea.additionalData.sector}</span>
                  </div>
                )}
                {idea.additionalData.technology && (
                  <div className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{idea.additionalData.technology}</span>
                  </div>
                )}
                {idea.additionalData.region && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{idea.additionalData.region}</span>
                  </div>
                )}
              </div>
            )}

            {idea.tags && idea.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-primary" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="transition-all hover:bg-primary/10">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {idea.additionalData && (
          <Tabs defaultValue={activeTab} className="mb-8" onValueChange={setActiveTab}>
            <div className="relative">
              <TabsList className="w-full flex justify-around border-b bg-transparent mb-6 overflow-x-auto gap-1">
                <TabsTrigger value="innovation" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 rounded-t-lg transition-all duration-200">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Innovation
                </TabsTrigger>
                <TabsTrigger value="market" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 rounded-t-lg transition-all duration-200">
                  <Target className="h-4 w-4 mr-2" />
                  Market
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 rounded-t-lg transition-all duration-200">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 rounded-t-lg transition-all duration-200">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="funding" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 rounded-t-lg transition-all duration-200">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Funding
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 rounded-t-lg transition-all duration-200">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>
              
              {/* Animated indicator for active tab */}
              <div className="absolute bottom-6 h-1 bg-primary transition-all duration-200 rounded-full"
                   style={{
                     left: `calc(${['innovation', 'market', 'progress', 'team', 'funding', 'documents'].indexOf(activeTab) * (100/6)}% + 1rem)`,
                     width: 'calc(100%/6 - 2rem)'
                   }}
              />
            </div>

            <TabsContent value="innovation" className="space-y-6 animate-fade-in">
              {!idea.additionalData?.innovation ? (
                <p className="text-center text-muted-foreground italic py-4">No innovation data available</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {idea.additionalData.innovation.projectDescription && (
                      <InfoCard 
                        title="Project Description"
                        icon={Lightbulb}
                        content={idea.additionalData.innovation.projectDescription}
                        variant="primary"
                      />
                    )}

                    {idea.additionalData.innovation.problemStatement && (
                      <InfoCard 
                        title="Problem Statement"
                        icon={Target}
                        content={idea.additionalData.innovation.problemStatement}
                        variant="danger"
                      />
                    )}

                    {idea.additionalData.innovation.solution && (
                      <InfoCard 
                        title="Solution"
                        icon={CheckCircle}
                        content={idea.additionalData.innovation.solution}
                        variant="success"
                      />
                    )}

                    {idea.additionalData.innovation.businessModel && (
                      <InfoCard 
                        title="Business Model"
                        icon={BarChart}
                        content={idea.additionalData.innovation.businessModel}
                        variant="info"
                      />
                    )}

                    {idea.additionalData.innovation.competitors && (
                      <InfoCard 
                        title="Competitors"
                        icon={Users}
                        content={idea.additionalData.innovation.competitors}
                        variant="warning"
                      />
                    )}

                    {idea.additionalData.innovation.differentiatingFactors && (
                      <InfoCard 
                        title="Differentiating Factors"
                        icon={Award}
                        content={idea.additionalData.innovation.differentiatingFactors}
                        variant="primary"
                      />
                    )}
                  </div>

                  {idea.additionalData.innovation.productVideoUrl && (
                    <div className="mt-6 bg-card p-4 rounded-lg border animate-fade-in">
                      <h3 className="font-semibold flex items-center mb-3">
                        <Video className="h-5 w-5 mr-2 text-primary" />
                        Product Video
                      </h3>
                      <Button variant="outline" className="text-primary hover:text-primary-foreground hover:bg-primary" asChild>
                        <a href={idea.additionalData.innovation.productVideoUrl} target="_blank" rel="noopener noreferrer">
                          Watch Product Video <ArrowLeft className="h-4 w-4 ml-2 rotate-[-135deg]" />
                        </a>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="market" className="space-y-6 animate-fade-in">
              {!idea.additionalData?.market ? (
                <p className="text-center text-muted-foreground italic py-4">No market data available</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {idea.additionalData.market.targetMarket && (
                      <InfoCard 
                        title="Target Market"
                        icon={Target}
                        content={idea.additionalData.market.targetMarket}
                        variant="primary"
                      />
                    )}

                    {idea.additionalData.market.marketSize && (
                      <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-3">
                          <CardTitle className="text-lg flex items-center text-green-700 dark:text-green-300">
                            <PieChart className="h-5 w-5 mr-2" />
                            Market Size
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-gray-700 dark:text-gray-300">{idea.additionalData.market.marketSize}</p>
                          {idea.additionalData.market.targetMarketShare && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Target Market Share: {idea.additionalData.market.targetMarketShare}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {idea.additionalData.market.currentMarkets && idea.additionalData.market.currentMarkets.length > 0 && (
                    <div className="mt-6 bg-card p-4 rounded-lg border">
                      <h3 className="font-semibold flex items-center mb-3">
                        <Globe className="h-5 w-5 mr-2 text-primary" />
                        Current Markets
                      </h3>
                      {renderMarketEntries(idea.additionalData.market.currentMarkets)}
                    </div>
                  )}

                  {idea.additionalData.market.futureMarkets && idea.additionalData.market.futureMarkets.length > 0 && (
                    <div className="mt-6 bg-card p-4 rounded-lg border">
                      <h3 className="font-semibold flex items-center mb-3">
                        <LineChart className="h-5 w-5 mr-2 text-primary" />
                        Future Expansion Markets
                      </h3>
                      {renderMarketEntries(idea.additionalData.market.futureMarkets)}
                    </div>
                  )}

                  {idea.additionalData.market.growthStrategy && (
                    <Card className="overflow-hidden shadow-sm mt-6">
                      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-3">
                        <CardTitle className="text-lg flex items-center text-blue-700 dark:text-blue-300">
                          <LineChart className="h-5 w-5 mr-2" />
                          Growth Strategy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-card-foreground">{idea.additionalData.market.growthStrategy}</p>
                        {(idea.additionalData.market.currentUsers || idea.additionalData.market.projectedUsers) && (
                          <div className="flex flex-wrap gap-4 mt-4">
                            {idea.additionalData.market.currentUsers && (
                              <div className="bg-muted p-3 rounded-md">
                                <p className="text-sm text-muted-foreground">Current Users</p>
                                <p className="font-semibold">{idea.additionalData.market.currentUsers}</p>
                              </div>
                            )}
                            {idea.additionalData.market.projectedUsers && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Projected Users</p>
                                <p className="font-semibold text-blue-800 dark:text-blue-200">{idea.additionalData.market.projectedUsers}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6 animate-fade-in">
              {!idea.additionalData?.progress ? (
                <p className="text-center text-muted-foreground italic py-4">No progress data available</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {idea.additionalData.progress.projectStage && (
                      <InfoCard 
                        title="Project Stage"
                        icon={Clock}
                        content={idea.additionalData.progress.projectStage}
                        variant="primary"
                      />
                    )}

                    {idea.additionalData.progress.currentProgress && (
                      <InfoCard 
                        title="Current Progress"
                        icon={CheckCircle}
                        content={idea.additionalData.progress.currentProgress}
                        variant="info"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card className={`p-4 ${idea.additionalData.progress.joinedIncubator ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'} hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Joined Incubator</p>
                        {idea.additionalData.progress.joinedIncubator ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </div>
                    </Card>

                    <Card className={`p-4 ${idea.additionalData.progress.wonEntrepreneurshipAward ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'} hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Won Awards</p>
                        {idea.additionalData.progress.wonEntrepreneurshipAward ? (
                          <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </div>
                    </Card>

                    <Card className={`p-4 ${idea.additionalData.progress.filedPatents ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'} hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Filed Patents</p>
                        {idea.additionalData.progress.filedPatents ? (
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="team" className="space-y-6 animate-fade-in">
              {!idea.additionalData?.team ? (
                <p className="text-center text-muted-foreground italic py-4">No team data available</p>
              ) : (
                <>
                  {idea.additionalData.team.teamDescription && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-primary/10 dark:bg-primary/20 pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          Team Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-card-foreground">{idea.additionalData.team.teamDescription}</p>
                        {idea.additionalData.team.numberOfCofounders && (
                          <div className="bg-muted p-2 rounded-md mt-3 inline-block">
                            <span className="text-sm">{idea.additionalData.team.numberOfCofounders} Co-founders</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {idea.additionalData.team.timeWorkingOnProject && (
                      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:shadow-md transition-all">
                        <p className="text-sm text-blue-700 dark:text-blue-300">Time Working on Project</p>
                        <p className="font-semibold text-blue-800 dark:text-blue-200 mt-1">{idea.additionalData.team.timeWorkingOnProject}</p>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 gap-2">
                      <Card className={`p-3 ${idea.additionalData.team.teamCapable ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'} hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Team is Capable</p>
                          {idea.additionalData.team.teamCapable ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </div>
                      </Card>

                      <Card className={`p-3 ${idea.additionalData.team.workedTogetherBefore ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'} hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Worked Together Before</p>
                          {idea.additionalData.team.workedTogetherBefore ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </div>
                      </Card>

                      <Card className={`p-3 ${idea.additionalData.team.launchedStartupBefore ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'} hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Launched Startup Before</p>
                          {idea.additionalData.team.launchedStartupBefore ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="funding" className="space-y-6 animate-fade-in">
              {!idea.additionalData?.funding ? (
                <p className="text-center text-muted-foreground italic py-4">No funding data available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {idea.additionalData.funding.fundraisingGoal && (
                    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-3">
                        <CardTitle className="text-lg flex items-center text-green-700 dark:text-green-300">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Fundraising Goal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-xl font-semibold text-green-700 dark:text-green-300">{idea.additionalData.funding.fundraisingGoal}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.funding.revenueProjection && (
                    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-3">
                        <CardTitle className="text-lg flex items-center text-blue-700 dark:text-blue-300">
                          <LineChart className="h-5 w-5 mr-2" />
                          Revenue Projection
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-xl font-semibold text-blue-700 dark:text-blue-300">{idea.additionalData.funding.revenueProjection}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {idea.additionalData?.presentation && (
                <div className="mt-6 flex flex-wrap gap-4">
                  {idea.additionalData.presentation.pitchDeckUrl && (
                    <Button variant="outline" className="group text-primary hover:text-primary-foreground hover:bg-primary transition-colors" asChild>
                      <a href={idea.additionalData.presentation.pitchDeckUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                        View Pitch Deck
                      </a>
                    </Button>
                  )}
                  
                  {idea.additionalData.presentation.pitchVideoUrl && (
                    <Button variant="outline" className="group text-primary hover:text-primary-foreground hover:bg-primary transition-colors" asChild>
                      <a href={idea.additionalData.presentation.pitchVideoUrl} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                        Watch Pitch Video
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 animate-fade-in">
              {(!idea.additionalData?.documents || idea.additionalData.documents.length === 0) && 
               (!idea.attachments || idea.attachments.length === 0) ? (
                <p className="text-center text-muted-foreground italic py-4">No documents available</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {idea.additionalData?.documents && idea.additionalData.documents.map((doc, index) => (
                    <Card key={`doc-${index}`} className="p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                        </div>
                      </div>
                      <Badge variant="outline" className="transition-all hover:bg-primary/10">{(doc.size / 1024).toFixed(0)} KB</Badge>
                    </Card>
                  ))}
                  
                  {idea.attachments && idea.attachments.map((attachment, index) => (
                    <Card key={`attachment-${index}`} className="p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                          Download
                        </a>
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {user?.role === "EXPERT" && (
          <div className="mb-8">
            <Button className="w-full sm:w-auto group bg-primary hover:bg-primary/80 transition-all">
              <Lightbulb className="h-4 w-4 mr-2 group-hover:animate-pulse" />
              Estimate This Idea
            </Button>
          </div>
        )}

        <div className="mt-8 bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-primary" />
            Comments ({idea.comments?.length || 0})
          </h3>
          
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit" className="self-end">Post</Button>
            </div>
          </form>
          
          <div className="space-y-4">
            {!idea.comments || idea.comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground text-center py-8">
                <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              idea.comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar className="h-8 w-8 border border-primary/10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-card-foreground mt-1">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IdeaDetails;
