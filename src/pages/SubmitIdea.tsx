
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import IdeaWizard from '@/components/IdeaWizard';

const SubmitIdea = () => {
  const { user } = useAuth();

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <IdeaWizard />
      </div>
    </Layout>
  );
};

export default SubmitIdea;
