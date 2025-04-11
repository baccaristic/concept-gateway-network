
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, ArrowRight, Loader2 } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitWithPayment: () => void;
  onCancel: () => void;
  amount: number;
}

const PaymentDialog = ({ open, onOpenChange, onSubmitWithPayment, onCancel, amount }: PaymentDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitWithPayment = async () => {
    try {
      setIsLoading(true);
      
      // Call the submit with payment function that will handle the redirection
      onSubmitWithPayment();
      
      toast({
        title: "Processing submission",
        description: "You'll be redirected to the payment page shortly.",
      });
    } catch (error) {
      console.error("Error processing submission:", error);
      toast({
        title: "Submission error",
        description: "There was a problem with your submission. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-primary" />
            Payment Required
          </DialogTitle>
          <DialogDescription>
            To submit your idea, a one-time payment is required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">Idea Submission Fee</span>
              <Badge className="ml-2 bg-primary" variant="default">
                <DollarSign className="h-3 w-3 mr-1" />
                {amount.toFixed(2)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This fee covers the cost of reviewing and processing your idea submission.
            </p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium mb-2">What happens next?</h4>
            <ol className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">1</span>
                <span>Your idea information will be sent to our server</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">2</span>
                <span>You'll be redirected to the secure Konnect payment page</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">3</span>
                <span>After successful payment, your idea will be automatically submitted</span>
              </li>
            </ol>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={handleSubmitWithPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Submit and Pay
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
