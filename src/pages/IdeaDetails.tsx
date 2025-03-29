
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, DollarSign, MessageCircle, ThumbsUp, User } from 'lucide-react';
import { Idea, Comment } from '@/types';
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
    switch (user.role) {
      case "ADMIN":
        return "/admin-dashboard"
      case "EXPERT":
        return "/expert-dashboard"
      case "INVESTOR":
        return "/investor-dashboard"
      default:
        return "/dashboard"
    }
  }

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

        <Card className="border-none shadow-md">
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

            {idea.attachments && idea.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Attachments</h3>
                <ul className="space-y-2">
                  {idea.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center">
                      <Button variant="ghost" className="h-8 px-2 text-blue-600">
                        {attachment.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center space-x-6 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleLike}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{idea.likes || 0}</span>
              </Button>
              
              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>{idea.comments?.length || 0} comments</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500">
                <User className="h-4 w-4" />
                <span>{idea.views || 0} views</span>
              </div>
            </div>
          </CardContent>
        </Card>
        { user.role === "EXPERT" && (<Button>Estimate</Button>)}

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
