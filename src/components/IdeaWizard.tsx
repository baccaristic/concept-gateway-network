import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { categories } from '@/constants'
import { cn } from '@/lib/utils';
import PaymentDialog from './PaymentDialog';
import { ideasApi } from '@/services/api';

const IdeaWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast()

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [marketResearch, setMarketResearch] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState('');
  const [monetizationStrategy, setMonetizationStrategy] = useState('');
  const [implementationChallenges, setImplementationChallenges] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !selectedCategory || !budget) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Show payment confirmation dialog
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Error in idea submission:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleSubmitWithPayment = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepare idea data
      const ideaData = {
        title,
        description,
        category: selectedCategory,
        estimatedBudget: parseFloat(budget) || undefined,
        additionalData: {
          marketResearch,
          targetAudience,
          competitiveAnalysis,
          monetizationStrategy,
          implementationChallenges,
        },
      };
      
      // Submit idea data to get payment URL
      const response = await ideasApi.submitIdea(ideaData);
      
      // Redirect to the payment URL
      if (response && response.payUrl) {
        window.location.href = response.payUrl;
      } else {
        throw new Error("No payment URL received from server");
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setShowPaymentDialog(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Your Idea</CardTitle>
        <CardDescription>Share your innovative idea with the world.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter your idea title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your idea in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="budget">Estimated Budget</Label>
          <Input
            type="number"
            id="budget"
            placeholder="Enter estimated budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="marketResearch">Market Research</Label>
          <Textarea
            id="marketResearch"
            placeholder="Share your market research insights"
            value={marketResearch}
            onChange={(e) => setMarketResearch(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Textarea
            id="targetAudience"
            placeholder="Describe your target audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="competitiveAnalysis">Competitive Analysis</Label>
          <Textarea
            id="competitiveAnalysis"
            placeholder="Analyze your competition"
            value={competitiveAnalysis}
            onChange={(e) => setCompetitiveAnalysis(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="monetizationStrategy">Monetization Strategy</Label>
          <Textarea
            id="monetizationStrategy"
            placeholder="Explain your monetization strategy"
            value={monetizationStrategy}
            onChange={(e) => setMonetizationStrategy(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="implementationChallenges">Implementation Challenges</Label>
          <Textarea
            id="implementationChallenges"
            placeholder="Describe potential implementation challenges"
            value={implementationChallenges}
            onChange={(e) => setImplementationChallenges(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? 'Submitting...' : 'Submit Idea'}
        </Button>
      </CardFooter>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onSubmitWithPayment={handleSubmitWithPayment}
        onCancel={() => setShowPaymentDialog(false)}
        amount={10.00} // Use your actual submission fee
      />
    </Card>
  );
};

export default IdeaWizard;
