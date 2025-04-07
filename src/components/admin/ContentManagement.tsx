
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContentService } from '@/hooks/useContentService';
import { Loader2, Eye } from 'lucide-react';

// Page content item component
const ContentItem = ({ item, onUpdate }) => {
  const [value, setValue] = useState(item.content_value);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(item.id, value);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(item.content_value);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 border border-border rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="text-sm font-medium">{item.content_key}</h4>
          <p className="text-xs text-muted-foreground">Type: {item.content_type}</p>
        </div>
        <div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <>
          {item.content_type === 'text' ? (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
            />
          ) : item.content_type === 'html' ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full min-h-[100px]"
            />
          ) : item.content_type === 'image' ? (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
              placeholder="Image URL"
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
            />
          )}
        </>
      ) : (
        <div className="bg-muted/30 p-3 rounded-md">
          {item.content_type === 'html' ? (
            <div className="max-h-[150px] overflow-y-auto">
              <code className="whitespace-pre-wrap text-sm">{item.content_value}</code>
            </div>
          ) : item.content_type === 'image' ? (
            <div className="flex items-center">
              <img 
                src={item.content_value} 
                alt="Preview" 
                className="h-16 w-auto object-cover mr-4 rounded-md"
              />
              <span className="text-sm truncate">{item.content_value}</span>
            </div>
          ) : (
            <p className="text-sm">{item.content_value}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Feature item component
const FeatureItem = ({ feature, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    title: feature.title,
    description: feature.description,
    icon_name: feature.icon_name,
    color: feature.color
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(feature.id, editData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: feature.title,
      description: feature.description,
      icon_name: feature.icon_name,
      color: feature.color
    });
    setIsEditing(false);
  };

  return (
    <div className="mb-6 border border-border rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="text-sm font-medium">Feature #{feature.display_order}</h4>
        </div>
        <div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Icon Name</label>
              <Input
                value={editData.icon_name}
                onChange={(e) => setEditData({...editData, icon_name: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color Class</label>
              <Input
                value={editData.color}
                onChange={(e) => setEditData({...editData, color: e.target.value})}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mr-3`}>
              <span className="text-lg">Icon</span>
            </div>
            <h3 className="text-base font-semibold">{feature.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Icon: {feature.icon_name}</div>
            <div>Color: {feature.color}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step item component
const StepItem = ({ step, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    title: step.title,
    description: step.description,
    step_number: step.step_number
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(step.id, editData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: step.title,
      description: step.description,
      step_number: step.step_number
    });
    setIsEditing(false);
  };

  return (
    <div className="mb-6 border border-border rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="text-sm font-medium">Step #{step.display_order}</h4>
        </div>
        <div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Step Number</label>
            <Input
              value={editData.step_number}
              onChange={(e) => setEditData({...editData, step_number: e.target.value})}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {step.step_number}
            </div>
            <h3 className="text-base font-semibold">{step.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
      )}
    </div>
  );
};

// Preview component
const HomePagePreview = ({ content, features, steps }) => {
  // Process content into a more usable structure
  const contentMap = {};
  if (content && Array.isArray(content)) {
    content.forEach(item => {
      if (!contentMap[item.section_name]) {
        contentMap[item.section_name] = {};
      }
      contentMap[item.section_name][item.content_key] = {
        value: item.content_value,
        type: item.content_type
      };
    });
  }

  // Get content with fallback
  const getContent = (section, key, defaultValue = '') => {
    if (contentMap[section] && contentMap[section][key]) {
      return contentMap[section][key].value;
    }
    return defaultValue;
  };

  // Render HTML content safely
  const renderHtml = (html) => {
    return { __html: html };
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-background p-6 md:p-10 preview-scale-75">
        {/* Simplified Hero Section */}
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-bold mb-4"
            dangerouslySetInnerHTML={renderHtml(getContent('hero', 'headline', 'Headline'))}
          />
          <p className="text-muted-foreground mb-4">
            {getContent('hero', 'subheadline', 'Subheadline')}
          </p>
          <div className="flex justify-center gap-2 mb-4">
            <Button size="sm">{getContent('hero', 'cta_primary_text', 'Primary CTA')}</Button>
            <Button size="sm" variant="outline">{getContent('hero', 'cta_secondary_text', 'Secondary CTA')}</Button>
          </div>
          {getContent('hero', 'image_url') && (
            <img 
              src={getContent('hero', 'image_url')} 
              alt="Hero" 
              className="w-full h-40 object-cover rounded-lg" 
            />
          )}
        </div>

        {/* Simplified Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">
            {getContent('features', 'headline', 'Features')}
          </h2>
          <p className="text-center text-muted-foreground mb-4">
            {getContent('features', 'subheadline', 'Features subheadline')}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features && Array.isArray(features) && features.map(feature => (
              <div key={feature.id} className="border rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <span className="text-xs">Icon</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">
            {getContent('howItWorks', 'headline', 'How It Works')}
          </h2>
          <p className="text-center text-muted-foreground mb-4">
            {getContent('howItWorks', 'subheadline', 'Process description')}
          </p>
          <div className="space-y-3">
            {steps && Array.isArray(steps) && steps.map(step => (
              <div key={step.id} className="flex items-start gap-2 border rounded-md p-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs shrink-0">
                  {step.step_number}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified CTA */}
        <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center">
          <h2 className="text-lg font-bold mb-2">
            {getContent('cta', 'headline', 'CTA Headline')}
          </h2>
          <p className="text-sm mb-4">
            {getContent('cta', 'subheadline', 'CTA Subheadline')}
          </p>
          <div className="flex justify-center gap-2">
            <Button size="sm" variant="secondary">
              {getContent('cta', 'button_primary_text', 'Primary')}
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              {getContent('cta', 'button_secondary_text', 'Secondary')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main ContentManagement component
export const ContentManagement = () => {
  const contentService = useContentService();
  const [content, setContent] = useState([]);
  const [features, setFeatures] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [contentData, featuresData, stepsData] = await Promise.all([
          contentService.getPageContent('home'),
          contentService.getHomepageFeatures(),
          contentService.getHomepageSteps()
        ]);
        
        setContent(contentData);
        setFeatures(featuresData);
        setSteps(stepsData);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleUpdateContent = async (id, value) => {
    const updatedItem = await contentService.updateContent(id, value);
    setContent(prev => prev.map(item => item.id === id ? updatedItem : item));
  };
  
  const handleUpdateFeature = async (id, updates) => {
    const updatedFeature = await contentService.updateHomepageFeature(id, updates);
    setFeatures(prev => prev.map(feature => feature.id === id ? updatedFeature : feature));
  };
  
  const handleUpdateStep = async (id, updates) => {
    const updatedStep = await contentService.updateHomepageStep(id, updates);
    setSteps(prev => prev.map(step => step.id === id ? updatedStep : step));
  };
  
  const organizeContentBySections = () => {
    const sections = {};
    
    if (content && Array.isArray(content)) {
      content.forEach(item => {
        if (!sections[item.section_name]) {
          sections[item.section_name] = [];
        }
        sections[item.section_name].push(item);
      });
    }
    
    return sections;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const contentSections = organizeContentBySections();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Content Management</CardTitle>
        <CardDescription>Edit the content of the home page</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General Content</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="steps">How It Works Steps</TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-1" />
                Live Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              {Object.entries(contentSections).map(([sectionName, items]) => (
                <div key={sectionName} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 capitalize">
                    {sectionName} Section
                  </h3>
                  {items.map(item => (
                    <ContentItem 
                      key={item.id} 
                      item={item} 
                      onUpdate={handleUpdateContent} 
                    />
                  ))}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="features">
              <div>
                <h3 className="text-lg font-semibold mb-4">Feature Cards</h3>
                {features && Array.isArray(features) && features.map(feature => (
                  <FeatureItem 
                    key={feature.id} 
                    feature={feature} 
                    onUpdate={handleUpdateFeature} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="steps">
              <div>
                <h3 className="text-lg font-semibold mb-4">Process Steps</h3>
                {steps && Array.isArray(steps) && steps.map(step => (
                  <StepItem 
                    key={step.id} 
                    step={step} 
                    onUpdate={handleUpdateStep} 
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div>
                <h3 className="text-lg font-semibold mb-4">Homepage Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a scaled-down preview of how the homepage will look with your content changes.
                </p>
                <HomePagePreview 
                  content={content} 
                  features={features && Array.isArray(features) ? features : []} 
                  steps={steps && Array.isArray(steps) ? steps : []} 
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Page
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
