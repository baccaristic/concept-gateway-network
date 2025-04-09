import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { User, Idea } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const ContentManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedType, setSelectedType] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContent, setFilteredContent] = useState<User[] | Idea[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await adminApi.getAllUsers();
        setUsers(usersData);
        setFilteredContent(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const fetchIdeas = async () => {
      try {
        const ideasData = await adminApi.getAllIdeas();
        setIdeas(ideasData);
        setFilteredContent(ideasData);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      }
    };

    if (selectedType === 'users') {
      fetchUsers();
    } else {
      fetchIdeas();
    }
  }, [selectedType]);

  useEffect(() => {
    const filterContent = () => {
      if (selectedType === 'users') {
        const filteredUsers = users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContent(filteredUsers);
      } else {
        const filteredIdeas = ideas.filter(idea =>
          idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContent(filteredIdeas);
      }
    };

    filterContent();
  }, [searchTerm, users, ideas, selectedType]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSearchTerm('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (idea: Idea) => {
    setSelectedIdea(idea);
    setNewStatus(idea.status);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedIdea(null);
  };

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedIdea) return;

    try {
      await adminApi.updateIdeaStatus(selectedIdea.id, newStatus as any);
      // Optimistically update the ideas state
      setIdeas(ideas.map(idea =>
        idea.id === selectedIdea.id ? { ...idea, status: newStatus as any } : idea
      ));
      toast({
        title: "Success",
        description: "Successfully updated the status",
      })
    } catch (error) {
      console.error('Failed to update idea status:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="ideas">Ideas</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder={`Search ${selectedType}`}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="mt-6">
        <Table>
          <TableCaption>A list of your content.</TableCaption>
          <TableHeader>
            {selectedType === 'users' ? (
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {Array.isArray(filteredContent) && filteredContent.map((content: User | Idea) => (
              selectedType === 'users' ? (
                <TableRow key={(content as User).id}>
                  <TableCell className="font-medium">{(content as User).id}</TableCell>
                  <TableCell>{(content as User).name}</TableCell>
                  <TableCell>{(content as User).email}</TableCell>
                  <TableCell>{(content as User).role}</TableCell>
                </TableRow>
              ) : (
                <TableRow key={(content as Idea).id}>
                  <TableCell className="font-medium">{(content as Idea).id}</TableCell>
                  <TableCell>{(content as Idea).title}</TableCell>
                  <TableCell>{(content as Idea).description}</TableCell>
                  <TableCell>{(content as Idea).status}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => handleOpenDialog(content as Idea)}>Update Status</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Idea Status</DialogTitle>
                          <DialogDescription>
                            Make changes to the idea status here. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Status
                            </Label>
                            <Select value={newStatus} onValueChange={handleStatusChange}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AWAITING_APPROVAL">Awaiting Approval</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="ESTIMATED">Estimated</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button onClick={handleUpdateStatus}>Update Status</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentManagement;
