
import { useState } from 'react';
import { Idea } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { expertApi } from '@/services/api';
import { toast } from 'sonner';

interface EstimationDialogProps {
  estimateDialogOpen: boolean;
  setEstimateDialogOpen: (open: boolean) => void;
  handleSubmitEstimation: (values: { estimatedPrice: number; notes: string }) => void;
  selectedIdea: Idea | null;
  isLoading: boolean;
}

export function EstimationDialog({
  estimateDialogOpen,
  setEstimateDialogOpen,
  selectedIdea,
  isLoading
}: EstimationDialogProps) {
  const [estimationPrice, setEstimationPrice] = useState(50000);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedIdea) return;
    
    try {
      setSubmitting(true);
      
      await expertApi.submitEstimation(selectedIdea.id, estimationPrice, notes);
      
      toast.success("Estimation submitted successfully");
      setEstimateDialogOpen(false);
      
      // Reset form
      setEstimationPrice(50000);
      setNotes('');
      
      // Refresh the page after 1 second to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting estimation:', error);
      toast.error("Failed to submit estimation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={estimateDialogOpen} onOpenChange={setEstimateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Estimate Idea: {selectedIdea?.title}</DialogTitle>
            <DialogDescription>
              Provide your professional estimation for this idea's implementation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="price">Estimated Budget (USD)</Label>
                <span className="text-lg font-semibold">${estimationPrice.toLocaleString()}</span>
              </div>
              <Slider
                id="price"
                min={5000}
                max={500000}
                step={5000}
                value={[estimationPrice]}
                onValueChange={(values) => setEstimationPrice(values[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$5,000</span>
                <span>$500,000</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimation-notes">Notes</Label>
              <Textarea
                id="estimation-notes"
                placeholder="Add your professional notes about this estimation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setEstimateDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={submitting || isLoading}
            >
              {submitting ? "Submitting..." : "Submit Estimation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
