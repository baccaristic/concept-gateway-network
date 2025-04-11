
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import IdeaWizard from '@/components/IdeaWizard';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SubmitIdea = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const paymentRef = searchParams.get('ref');
  const paymentResult = searchParams.get('result');

  // If we have a payment reference in the URL, we came from a payment redirect
  const isPaymentRedirect = !!paymentRef;

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {isPaymentRedirect && (
          <Alert className="mb-6" variant={paymentResult === 'success' ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {paymentResult === 'success' ? 'Payment Processing' : 'Payment Incomplete'}
            </AlertTitle>
            <AlertDescription>
              {paymentResult === 'success' 
                ? 'Your payment is being processed. If your idea is not visible in your dashboard within a few minutes, please contact support.' 
                : 'Your payment was not completed. Please try submitting your idea again.'}
            </AlertDescription>
          </Alert>
        )}
        
        <IdeaWizard />
      </div>
    </Layout>
  );
};

export default SubmitIdea;
