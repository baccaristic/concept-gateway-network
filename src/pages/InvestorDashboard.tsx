
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { investorApi, ideasApi } from '@/services/api';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Idea, Agreement } from '@/types';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const InvestorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ideas');

  // Fetch available ideas
  const { data: availableIdeas, isLoading: ideasLoading, error: ideasError } = useQuery({
    queryKey: ['investor', 'available-ideas'],
    queryFn: () => ideasApi.getInvestorEstimatedIdeas(),
  });

  // Fetch investor's agreements
  const { data: agreements, isLoading: agreementsLoading, error: agreementsError } = useQuery({
    queryKey: ['investor', 'agreements'],
    queryFn: () => investorApi.getMyAgreements(),
  });

  // Create a new agreement
  const handleCreateAgreement = async (ideaId: string) => {
    try {
      await investorApi.createAgreement(ideaId);
      toast.success(t('investor.agreementCreated'));
      // Refresh agreements data
    } catch (error) {
      toast.error(t('investor.agreementError'));
      console.error('Error creating agreement:', error);
    }
  };

  // View idea details
  const handleViewIdea = (ideaId: string) => {
    navigate(`/ideas/${ideaId}`);
  };

  // Check if agreement exists for an idea
  const hasAgreement = (ideaId: string): boolean => {
    return agreements?.some(agreement => agreement.ideaId === ideaId) || false;
  };

  // Filter ideas with attached agreements
  const ideasWithAgreements = availableIdeas?.filter(
    idea => agreements?.some(agreement => agreement.ideaId === idea.id)
  ) || [];

  if (ideasLoading || agreementsLoading) {
    return (
      <Layout user={user}>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (ideasError || agreementsError) {
    return (
      <Layout user={user}>
        <div className="container mx-auto py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-600">
              {t('common.errorLoading')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{t('investor.dashboard')}</h1>
        
        <Tabs defaultValue="ideas" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="ideas">{t('investor.availableIdeas')}</TabsTrigger>
            <TabsTrigger value="investments">{t('investor.myInvestments')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas" className="space-y-4">
            {availableIdeas && availableIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIdeas.map(idea => (
                  <Card key={idea.id} className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="line-clamp-2">{idea.title}</span>
                        <Badge>{idea.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {idea.category || t('common.uncategorized')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="line-clamp-3 text-sm text-gray-600 mb-4">
                        {idea.description}
                      </p>
                      {idea.estimatedPrice && (
                        <div className="mt-2">
                          <span className="font-semibold">{t('idea.estimatedPrice')}:</span>{' '}
                          ${idea.estimatedPrice.toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewIdea(idea.id)}
                      >
                        {t('common.viewDetails')}
                      </Button>
                      
                      {hasAgreement(idea.id) ? (
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {t('investor.agreementExists')}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => handleCreateAgreement(idea.id)}
                        >
                          {t('investor.createAgreement')}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <p className="text-gray-600">{t('investor.noAvailableIdeas')}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="investments" className="space-y-4">
            {agreements && agreements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideasWithAgreements.map(idea => {
                  const agreement = agreements.find(a => a.ideaId === idea.id);
                  return (
                    <Card key={idea.id} className="h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span className="line-clamp-2">{idea.title}</span>
                          <Badge variant={agreement?.status === 'SIGNED' ? 'default' : 'outline'}>
                            {agreement?.status || 'PENDING'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {idea.category || t('common.uncategorized')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="line-clamp-3 text-sm text-gray-600 mb-4">
                          {idea.description}
                        </p>
                        {idea.estimatedPrice && (
                          <div className="mt-2">
                            <span className="font-semibold">{t('idea.estimatedPrice')}:</span>{' '}
                            ${idea.estimatedPrice.toLocaleString()}
                          </div>
                        )}
                        {agreement && (
                          <div className="mt-2">
                            <span className="font-semibold">{t('investor.agreementDate')}:</span>{' '}
                            {new Date(agreement.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleViewIdea(idea.id)}
                        >
                          {t('common.viewDetails')}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <p className="text-gray-600">{t('investor.noInvestments')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InvestorDashboard;
