
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContentService } from '@/hooks/useContentService';
import { Loader2 } from 'lucide-react';

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

// Main ContentManagement component
export const ContentManagement = () => {
  const contentService = useContentService();
  const [content, setContent] = useState([]);
  const [features, setFeatures] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
    
    content.forEach(item => {
      if (!sections[item.section_name]) {
        sections[item.section_name] = [];
      }
      sections[item.section_name].push(item);
    });
    
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
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Content</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="steps">How It Works Steps</TabsTrigger>
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
              {features.map(feature => (
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
              {steps.map(step => (
                <StepItem 
                  key={step.id} 
                  step={step} 
                  onUpdate={handleUpdateStep} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
