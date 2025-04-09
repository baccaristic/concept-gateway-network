
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
  Video, Target, CheckCircle, Clock, LineChart, BarChart, CreditCard 
} from 'lucide-react';
import { Idea, Comment, MarketEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ideasApi } from '@/services/api';
import { useAdminService } from '@/hooks/useAdminService';

const IdeaDetails = () => {
  const { ideaId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminService = useAdminService();
  
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error adding comment:', error);
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
    } catch (error) {
      console.error('Error liking idea:', error);
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
    if (!markets || markets.length === 0) return <p className="text-gray-500 italic">No market entries</p>;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {markets.map((market, index) => (
          <Card key={index} className="p-3 border shadow-sm">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">
                <Globe className="h-4 w-4 inline mr-1" /> {market.target}
              </span>
              <div className="flex justify-between text-xs text-gray-500">
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
            <div className="animate-pulse space-y-4">
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-64 w-full" />
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
            <p className="mb-6 text-gray-600">The idea you're looking for doesn't exist or has been removed.</p>
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
        <Link to={getDashboardLink()} className="flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="border-none shadow-md mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{idea.title}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  Submitted {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {idea.status === 'APPROVED' && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Approved
                  </Badge>
                )}
                {idea.status === 'AWAITING_APPROVAL' && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    Awaiting Approval
                  </Badge>
                )}
                {idea.status === 'ESTIMATED' && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Estimated
                  </Badge>
                )}
                {idea.status === 'CONFIRMED' && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    Confirmed
                  </Badge>
                )}
                {idea.category && (
                  <Badge variant="secondary">{idea.category}</Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${idea.submitterName || 'User'}`} />
                <AvatarFallback>{(idea.submitterName || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{idea.submitterName || 'Unknown User'}</p>
                <p className="text-sm text-gray-500">Idea Creator</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{idea.description}</p>
            </div>

            {idea.estimatedBudget && (
              <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-md">
                <DollarSign className="h-5 w-5 mr-2" />
                <span className="font-semibold">Estimated Budget: ${idea.estimatedBudget.toLocaleString()}</span>
              </div>
            )}

            {idea.additionalData?.sector && (
              <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-md">
                {idea.additionalData.sector && (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-sm">{idea.additionalData.sector}</span>
                  </div>
                )}
                {idea.additionalData.technology && (
                  <div className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-sm">{idea.additionalData.technology}</span>
                  </div>
                )}
                {idea.additionalData.region && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-sm">{idea.additionalData.region}</span>
                  </div>
                )}
              </div>
            )}

            {idea.tags && idea.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {idea.additionalData && (
          <Tabs defaultValue="innovation" className="mb-8">
            <TabsList className="w-full flex justify-around border-b bg-transparent mb-6 overflow-x-auto">
              <TabsTrigger value="innovation" className="data-[state=active]:bg-primary/10 px-4">
                <Lightbulb className="h-4 w-4 mr-2" />
                Innovation
              </TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-primary/10 px-4">
                <Target className="h-4 w-4 mr-2" />
                Market
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-primary/10 px-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-primary/10 px-4">
                <Users className="h-4 w-4 mr-2" />
                Team
              </TabsTrigger>
              <TabsTrigger value="funding" className="data-[state=active]:bg-primary/10 px-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Funding
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-primary/10 px-4">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="innovation" className="space-y-6">
              {!idea.additionalData?.innovation ? (
                <p className="text-center text-gray-500 italic py-4">No innovation data available</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {idea.additionalData.innovation.projectDescription && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-primary/10 pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2" />
                          Project Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.innovation.projectDescription}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.innovation.problemStatement && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-red-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-red-700">
                          <Target className="h-5 w-5 mr-2" />
                          Problem Statement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.innovation.problemStatement}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.innovation.solution && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-green-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Solution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.innovation.solution}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.innovation.businessModel && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-blue-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-blue-700">
                          <BarChart className="h-5 w-5 mr-2" />
                          Business Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.innovation.businessModel}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.innovation.competitors && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-orange-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-orange-700">
                          <Users className="h-5 w-5 mr-2" />
                          Competitors
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.innovation.competitors}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.innovation.differentiatingFactors && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-purple-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-purple-700">
                          <Award className="h-5 w-5 mr-2" />
                          Differentiating Factors
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.innovation.differentiatingFactors}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {idea.additionalData?.innovation?.productVideoUrl && (
                <div className="mt-6">
                  <h3 className="font-semibold flex items-center mb-3">
                    <Video className="h-5 w-5 mr-2" />
                    Product Video
                  </h3>
                  <Button variant="outline" className="text-blue-600" asChild>
                    <a href={idea.additionalData.innovation.productVideoUrl} target="_blank" rel="noopener noreferrer">
                      Watch Product Video <ArrowLeft className="h-4 w-4 ml-2 rotate-[-135deg]" />
                    </a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              {!idea.additionalData?.market ? (
                <p className="text-center text-gray-500 italic py-4">No market data available</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {idea.additionalData.market.targetMarket && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-primary/10 pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Target Market
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.market.targetMarket}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.market.marketSize && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-green-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-green-700">
                          <PieChart className="h-5 w-5 mr-2" />
                          Market Size
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.market.marketSize}</p>
                        {idea.additionalData.market.targetMarketShare && (
                          <p className="text-sm text-gray-500 mt-2">
                            Target Market Share: {idea.additionalData.market.targetMarketShare}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {idea.additionalData?.market?.currentMarkets && idea.additionalData.market.currentMarkets.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold flex items-center mb-3">
                    <Globe className="h-5 w-5 mr-2" />
                    Current Markets
                  </h3>
                  {renderMarketEntries(idea.additionalData.market.currentMarkets)}
                </div>
              )}

              {idea.additionalData?.market?.futureMarkets && idea.additionalData.market.futureMarkets.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold flex items-center mb-3">
                    <LineChart className="h-5 w-5 mr-2" />
                    Future Expansion Markets
                  </h3>
                  {renderMarketEntries(idea.additionalData.market.futureMarkets)}
                </div>
              )}

              {idea.additionalData?.market?.growthStrategy && (
                <Card className="overflow-hidden shadow-sm mt-6">
                  <CardHeader className="bg-blue-50 pb-3">
                    <CardTitle className="text-lg flex items-center text-blue-700">
                      <LineChart className="h-5 w-5 mr-2" />
                      Growth Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-700">{idea.additionalData.market.growthStrategy}</p>
                    {(idea.additionalData.market.currentUsers || idea.additionalData.market.projectedUsers) && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {idea.additionalData.market.currentUsers && (
                          <div className="bg-gray-100 p-3 rounded-md">
                            <p className="text-sm text-gray-600">Current Users</p>
                            <p className="font-semibold">{idea.additionalData.market.currentUsers}</p>
                          </div>
                        )}
                        {idea.additionalData.market.projectedUsers && (
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-700">Projected Users</p>
                            <p className="font-semibold text-blue-800">{idea.additionalData.market.projectedUsers}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {!idea.additionalData?.progress ? (
                <p className="text-center text-gray-500 italic py-4">No progress data available</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {idea.additionalData.progress.projectStage && (
                      <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="bg-primary/10 pb-3">
                          <CardTitle className="text-lg flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            Project Stage
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-gray-700">{idea.additionalData.progress.projectStage}</p>
                        </CardContent>
                      </Card>
                    )}

                    {idea.additionalData.progress.currentProgress && (
                      <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="bg-blue-50 pb-3">
                          <CardTitle className="text-lg flex items-center text-blue-700">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Current Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-gray-700">{idea.additionalData.progress.currentProgress}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card className={`p-4 ${idea.additionalData.progress.joinedIncubator ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Joined Incubator</p>
                        {idea.additionalData.progress.joinedIncubator ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </div>
                    </Card>

                    <Card className={`p-4 ${idea.additionalData.progress.wonEntrepreneurshipAward ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Won Awards</p>
                        {idea.additionalData.progress.wonEntrepreneurshipAward ? (
                          <Award className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </div>
                    </Card>

                    <Card className={`p-4 ${idea.additionalData.progress.filedPatents ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Filed Patents</p>
                        {idea.additionalData.progress.filedPatents ? (
                          <FileText className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              {!idea.additionalData?.team ? (
                <p className="text-center text-gray-500 italic py-4">No team data available</p>
              ) : (
                <>
                  {idea.additionalData.team.teamDescription && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-primary/10 pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Team Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{idea.additionalData.team.teamDescription}</p>
                        {idea.additionalData.team.numberOfCofounders && (
                          <div className="bg-gray-100 p-2 rounded-md mt-3 inline-block">
                            <span className="text-sm">{idea.additionalData.team.numberOfCofounders} Co-founders</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {idea.additionalData.team.timeWorkingOnProject && (
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-blue-700">Time Working on Project</p>
                        <p className="font-semibold text-blue-800 mt-1">{idea.additionalData.team.timeWorkingOnProject}</p>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 gap-2">
                      <Card className={`p-3 ${idea.additionalData.team.teamCapable ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Team is Capable</p>
                          {idea.additionalData.team.teamCapable ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </div>
                      </Card>

                      <Card className={`p-3 ${idea.additionalData.team.workedTogetherBefore ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Worked Together Before</p>
                          {idea.additionalData.team.workedTogetherBefore ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </div>
                      </Card>

                      <Card className={`p-3 ${idea.additionalData.team.launchedStartupBefore ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Launched Startup Before</p>
                          {idea.additionalData.team.launchedStartupBefore ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="funding" className="space-y-6">
              {!idea.additionalData?.funding ? (
                <p className="text-center text-gray-500 italic py-4">No funding data available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {idea.additionalData.funding.fundraisingGoal && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-green-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-green-700">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Fundraising Goal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-xl font-semibold text-green-700">{idea.additionalData.funding.fundraisingGoal}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.additionalData.funding.revenueProjection && (
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="bg-blue-50 pb-3">
                        <CardTitle className="text-lg flex items-center text-blue-700">
                          <LineChart className="h-5 w-5 mr-2" />
                          Revenue Projection
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-xl font-semibold text-blue-700">{idea.additionalData.funding.revenueProjection}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {idea.additionalData?.presentation && (
                <div className="mt-6 flex flex-wrap gap-4">
                  {idea.additionalData.presentation.pitchDeckUrl && (
                    <Button variant="outline" className="text-blue-600" asChild>
                      <a href={idea.additionalData.presentation.pitchDeckUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Pitch Deck
                      </a>
                    </Button>
                  )}
                  
                  {idea.additionalData.presentation.pitchVideoUrl && (
                    <Button variant="outline" className="text-blue-600" asChild>
                      <a href={idea.additionalData.presentation.pitchVideoUrl} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4 mr-2" />
                        Watch Pitch Video
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              {(!idea.additionalData?.documents || idea.additionalData.documents.length === 0) && 
               (!idea.attachments || idea.attachments.length === 0) ? (
                <p className="text-center text-gray-500 italic py-4">No documents available</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {idea.additionalData?.documents && idea.additionalData.documents.map((doc, index) => (
                    <Card key={`doc-${index}`} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {doc.description && <p className="text-sm text-gray-500">{doc.description}</p>}
                        </div>
                      </div>
                      <Badge variant="outline">{(doc.size / 1024).toFixed(0)} KB</Badge>
                    </Card>
                  ))}
                  
                  {idea.attachments && idea.attachments.map((attachment, index) => (
                    <Card key={`attachment-${index}`} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
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
            <Button className="w-full sm:w-auto">
              <Lightbulb className="h-4 w-4 mr-2" />
              Estimate This Idea
            </Button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments ({idea.comments?.length || 0})</h3>
          
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex gap-4">
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit">Post</Button>
            </div>
          </form>
          
          <div className="space-y-4">
            {!idea.comments || idea.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              idea.comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.userName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
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
