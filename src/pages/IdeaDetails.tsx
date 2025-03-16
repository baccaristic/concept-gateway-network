
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, DollarSign, MessageCircle, ThumbsUp, User } from 'lucide-react';
import { Idea } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Mock data
const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Personal Health Assistant",
    description: "A mobile app that uses AI to track user health data and provide personalized recommendations for improving wellness. The app would integrate with wearable devices, analyze patterns in sleep, exercise, and nutrition, and offer actionable insights based on medical research.",
    category: "Healthcare",
    status: "approved",
    estimatedBudget: 8500,
    submittedBy: "user123",
    submitterName: "Alex Johnson",
    tags: ["AI", "Healthcare", "Mobile"],
    createdAt: new Date("2023-05-15"),
    views: 142,
    likes: 37,
    attachments: ["specification.pdf"],
    comments: [
      {
        id: "c1",
        text: "This has great potential for preventative healthcare!",
        user: "investor55",
        userName: "Sarah Williams",
        createdAt: new Date("2023-05-17")
      },
      {
        id: "c2",
        text: "Have you considered adding integration with healthcare providers' systems?",
        user: "expert12",
        userName: "Dr. Michael Chen",
        createdAt: new Date("2023-05-18")
      }
    ]
  },
  {
    id: "2",
    title: "Sustainable Urban Farming Platform",
    description: "A B2B SaaS platform that helps urban farming companies optimize their production, reduce resource consumption, and connect with local businesses. The platform would use IoT data from sensors, predictive analytics for harvest planning, and a marketplace for selling directly to restaurants and grocery stores.",
    category: "Agriculture",
    status: "pending",
    submittedBy: "user456",
    submitterName: "Jamie Smith",
    tags: ["Sustainability", "Agriculture", "B2B", "IoT"],
    createdAt: new Date("2023-06-02"),
    views: 98,
    likes: 22,
    attachments: [],
    comments: []
  },
];

const IdeaDetails = () => {
  const { ideaId } = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch for the idea details
    setTimeout(() => {
      const foundIdea = mockIdeas.find(i => i.id === ideaId);
      setIdea(foundIdea || null);
      setLoading(false);
    }, 500);
  }, [ideaId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // In a real app, this would be an API call
    console.log("Adding comment:", comment);
    
    // For demo purposes, add the comment to the idea object
    if (idea) {
      const newComment = {
        id: `c${Date.now()}`,
        text: comment,
        user: "currentUser",
        userName: "Current User",
        createdAt: new Date()
      };
      
      setIdea({
        ...idea,
        comments: [...idea.comments, newComment]
      });
      
      setComment('');
    }
  };

  const handleLike = () => {
    if (idea) {
      setIdea({
        ...idea,
        likes: idea.likes + 1
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-96"></div>
              <div className="h-4 bg-gray-200 rounded w-60"></div>
              <div className="h-64 bg-gray-200 rounded w-full"></div>
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
    <Layout>
      <div className="container py-8">
        <Link to="/dashboard" className="flex items-center text-primary hover:underline mb-6">
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
                  Submitted {formatDistanceToNow(idea.createdAt, { addSuffix: true })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {idea.status === 'approved' && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Approved
                  </Badge>
                )}
                {idea.status === 'pending' && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    Pending
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
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${idea.submitterName}`} />
                <AvatarFallback>{idea.submitterName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{idea.submitterName}</p>
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

            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            {idea.attachments && idea.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Attachments</h3>
                <ul className="space-y-2">
                  {idea.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center">
                      <Button variant="ghost" className="h-8 px-2 text-blue-600">
                        {attachment}
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
                <span>{idea.likes}</span>
              </Button>
              
              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>{idea.comments.length} comments</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500">
                <User className="h-4 w-4" />
                <span>{idea.views} views</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments ({idea.comments.length})</h3>
          
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
            {idea.comments.length === 0 ? (
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
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
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
