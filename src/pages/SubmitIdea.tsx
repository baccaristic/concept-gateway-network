
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const categories = [
  "Technology",
  "Health",
  "Education",
  "Finance",
  "Environment",
  "Food",
  "Entertainment",
  "Social",
  "Transportation",
  "Other"
];

const SubmitIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);

      const rep = await fetch('http://localhost:8083/ideas/new', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          category,
          estimated_budget: estimatedBudget ? Number(estimatedBudget) : null})
      });
      if (rep.ok) {
        toast.success('Your idea has been submitted successfully!');
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Failed to submit idea: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Submit Your Idea</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Idea Submission Form</CardTitle>
            <CardDescription>
              Tell us about your innovative idea and get feedback from experts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Idea Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="Give your idea a catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe your idea in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Estimated Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter estimated budget"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Idea'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <p>
              Your idea will be reviewed by our experts.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default SubmitIdea;
