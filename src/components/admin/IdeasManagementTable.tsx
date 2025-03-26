
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Idea, IdeaStatus } from '@/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IdeasManagementTableProps {
  ideas: Idea[];
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => Promise<void>;
  onDeleteIdea: (ideaId: string) => Promise<void>;
}

export function IdeasManagementTable({ ideas, onUpdateStatus, onDeleteIdea }: IdeasManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter ideas based on search term
  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (idea.category && idea.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIdeas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell>{idea.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      idea.status === 'APPROVED' ? 'default' :
                      idea.status === 'AWAITING_APPROVAL' ? 'secondary' :
                      idea.status === 'ESTIMATED' ? 'destructive' :
                      'outline'
                    }>
                      {idea.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{idea.category || '-'}</TableCell>
                  <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Select
                        defaultValue={idea.status}
                        onValueChange={(value) => onUpdateStatus(idea.id, value as IdeaStatus)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AWAITING_APPROVAL">Awaiting Approval</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="ESTIMATED">Estimated</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
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
                        onClick={() => onDeleteIdea(idea.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
