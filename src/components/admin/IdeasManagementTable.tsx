import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Idea, IdeaStatus, User } from '@/types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { adminApi } from '@/services/api';

interface IdeasManagementTableProps {
  ideas: Idea[];
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => Promise<void>;
  onDeleteIdea: (ideaId: string) => Promise<void>;
}

export function IdeasManagementTable({ ideas, onUpdateStatus, onDeleteIdea }: IdeasManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [showAssignExpertDialog, setShowAssignExpertDialog] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<IdeaStatus | null>(null);
  const [experts, setExperts] = useState<User[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showAssignExpertDialog) {
      fetchExperts();
    }
  }, [showAssignExpertDialog]);

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const expertsData = await adminApi.getAllExperts();
      setExperts(expertsData);
      setIsLoading(false);
      
      if (expertsData.length > 0) {
        setSelectedExpertId(expertsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load experts');
      setIsLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (idea.category && idea.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = async (ideaId: string, newStatus: IdeaStatus) => {
    if (newStatus === 'APPROVED') {
      setCurrentIdeaId(ideaId);
      setPendingStatus(newStatus);
      setShowAssignExpertDialog(true);
    } else {
      await onUpdateStatus(ideaId, newStatus);
    }
  };

  const handleAssignExpert = async () => {
    if (!currentIdeaId || !selectedExpertId || !pendingStatus) return;

    try {
      setIsLoading(true);
      
      await adminApi.assignIdeaToExpert(currentIdeaId, selectedExpertId);
      
      await onUpdateStatus(currentIdeaId, pendingStatus);
      
      toast.success('Idea assigned to expert and status updated successfully');
      
      setShowAssignExpertDialog(false);
      setCurrentIdeaId(null);
      setPendingStatus(null);
      setSelectedExpertId('');
    } catch (error) {
      console.error('Error assigning expert:', error);
      toast.error('Failed to assign expert to idea');
    } finally {
      setIsLoading(false);
    }
  };

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
                        onValueChange={(value) => handleStatusChange(idea.id, value as IdeaStatus)}
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

      <Dialog open={showAssignExpertDialog} onOpenChange={setShowAssignExpertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Idea to an Expert</DialogTitle>
            <DialogDescription>
              Select an expert to review and estimate this idea.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label htmlFor="expert-select" className="text-sm font-medium block mb-2">
              Select Expert
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
              </div>
            ) : experts.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-gray-500">No experts available</p>
              </div>
            ) : (
              <Select value={selectedExpertId} onValueChange={setSelectedExpertId}>
                <SelectTrigger id="expert-select">
                  <SelectValue placeholder="Select an expert" />
                </SelectTrigger>
                <SelectContent>
                  {experts.map((expert) => (
                    <SelectItem key={expert.id} value={expert.id}>
                      {expert.name} ({expert.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAssignExpertDialog(false);
                setCurrentIdeaId(null);
                setPendingStatus(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignExpert} 
              disabled={!selectedExpertId || isLoading}
            >
              {isLoading ? 'Assigning...' : 'Assign Expert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
