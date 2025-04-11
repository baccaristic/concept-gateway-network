import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ideasApi } from '@/services/api';
import { Idea } from '@/types';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns';
import { MoreVertical, Edit, Eye, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface IdeaWithView extends Idea {
  canView: boolean;
}

const InvestorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<IdeaWithView[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIdeas = async () => {
    try {
      const ideas = await ideasApi.getInvestorEstimatedIdeas();
      return ideas.map(idea => ({
        ...idea,
        canView: idea.canView === undefined ? false : idea.canView
      } as IdeaWithView));
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ideas. Please try again.",
        variant: "destructive",
      })
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadIdeas = async () => {
      const fetchedIdeas = await fetchIdeas();
      setIdeas(fetchedIdeas);
    };

    loadIdeas();
  }, []);

  const handleViewDetails = (ideaId: string) => {
    navigate(`/ideas/${ideaId}`);
  };

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Investor Dashboard</CardTitle>
            <CardDescription>Here are the estimated ideas for investors.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading ideas...</p>
            ) : (
              <div className="grid gap-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ideas.map((idea) => (
                      <TableRow key={idea.id}>
                        <TableCell>{idea.title}</TableCell>
                        <TableCell>{idea.category}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{idea.status}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(idea.createdAt), 'PPP')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(idea.id)}>
                                View <Eye className="mr-2 h-4 w-4" />
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Help <Copy className="mr-2 h-4 w-4" />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InvestorDashboard;
