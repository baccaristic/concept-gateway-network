
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentApi } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { PaymentStatus } from '@/types';

const PaymentRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    const result = searchParams.get('result');
    
    if (!ref) {
      setStatus('error');
      setErrorMessage('Missing payment reference');
      return;
    }
    
    setPaymentRef(ref);
    
    const checkPaymentStatus = async () => {
      try {
        const payment = await paymentApi.getPaymentStatus(ref);
        setPaymentStatus(payment.status);
        
        if (payment.status === 'COMPLETED') {
          setStatus('success');
        } else if (payment.status === 'FAILED' || payment.status === 'CANCELLED') {
          setStatus('error');
          setErrorMessage('Payment was not successful');
        } else {
          // Still pending, check again in 2 seconds
          setTimeout(checkPaymentStatus, 2000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
        setErrorMessage('Error checking payment status');
      }
    };
    
    checkPaymentStatus();
  }, [searchParams]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTryAgain = () => {
    navigate('/submit-idea');
  };

  return (
    <Layout minimal>
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {status === 'loading' && 'Processing Payment...'}
              {status === 'success' && 'Payment Successful'}
              {status === 'error' && 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center py-6">
            {status === 'loading' && (
              <div className="text-center">
                <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Checking your payment status...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Your payment was successful!</p>
                <p className="text-sm text-muted-foreground">Your idea has been submitted successfully.</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Payment Reference: <span className="font-mono">{paymentRef}</span>
                </p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">{errorMessage || 'There was a problem with your payment'}</p>
                <p className="text-sm text-muted-foreground">Please try again or contact support if the problem persists.</p>
                {paymentRef && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Payment Reference: <span className="font-mono">{paymentRef}</span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            {status === 'success' && (
              <Button onClick={handleGoToDashboard}>
                Go to Dashboard
              </Button>
            )}
            
            {status === 'error' && (
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleGoToDashboard}>
                  Go to Dashboard
                </Button>
                <Button onClick={handleTryAgain}>
                  Try Again
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentRedirect;
