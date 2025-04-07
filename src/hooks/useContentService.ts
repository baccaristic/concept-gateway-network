
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  page_name: string;
  section_name: string;
  content_key: string;
  content_value: string;
  content_type: string;
}

interface HomepageFeature {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color: string;
  display_order: number;
}

interface HomepageStep {
  id: string;
  title: string;
  description: string;
  step_number: string;
  display_order: number;
}

export function useContentService() {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all content for a specific page
  const getPageContent = async (pageName: string): Promise<ContentItem[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_name', pageName)
        .order('section_name', { ascending: true })
        .order('content_key', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error(`Error fetching page content: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a content item
  const updateContent = async (id: string, contentValue: string): Promise<ContentItem> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_content')
        .update({ content_value: contentValue, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Content updated successfully');
      return data;
    } catch (error) {
      toast.error(`Error updating content: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get all homepage features
  const getHomepageFeatures = async (): Promise<HomepageFeature[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_features')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error(`Error fetching homepage features: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a homepage feature
  const updateHomepageFeature = async (
    id: string, 
    updates: Partial<HomepageFeature>
  ): Promise<HomepageFeature> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_features')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Feature updated successfully');
      return data;
    } catch (error) {
      toast.error(`Error updating feature: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get all homepage steps
  const getHomepageSteps = async (): Promise<HomepageStep[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_steps')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error(`Error fetching homepage steps: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a homepage step
  const updateHomepageStep = async (
    id: string, 
    updates: Partial<HomepageStep>
  ): Promise<HomepageStep> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_steps')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Step updated successfully');
      return data;
    } catch (error) {
      toast.error(`Error updating step: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getPageContent,
    updateContent,
    getHomepageFeatures,
    updateHomepageFeature,
    getHomepageSteps,
    updateHomepageStep
  };
}
