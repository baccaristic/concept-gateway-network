
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ideasApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define step types for strong typing
type WizardStep = 'generalInfo' | 'details' | 'team' | 'budget' | 'review';

// Define industry categories
const industryCategories = [
  "Technology",
  "Health",
  "Education",
  "Finance",
  "Environment",
  "Food",
  "Entertainment",
  "Social",
  "Transportation",
  "Other"
];

// Define sectors based on industry
const sectors = {
  "Technology": ["Software", "Hardware", "AI", "Blockchain", "IoT", "Cloud Computing", "Other"],
  "Health": ["Medical Devices", "Healthcare Services", "Biotechnology", "Pharmaceuticals", "Mental Health", "Other"],
  "Education": ["EdTech", "Online Learning", "K-12", "Higher Education", "Professional Development", "Other"],
  "Finance": ["FinTech", "Banking", "Insurance", "Investment", "Cryptocurrency", "Other"],
  "Environment": ["CleanTech", "Renewable Energy", "Waste Management", "Conservation", "Sustainable Products", "Other"],
  "Food": ["FoodTech", "Agriculture", "Restaurant", "Food Delivery", "Nutrition", "Other"],
  "Entertainment": ["Media", "Gaming", "Streaming", "Live Events", "Content Creation", "Other"],
  "Social": ["Social Network", "Community Platform", "Messaging", "Dating", "Other"],
  "Transportation": ["Mobility", "Logistics", "Automotive", "Ride Sharing", "Public Transport", "Other"],
  "Other": ["Other"]
};

// Define regions
const regions = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
  "Middle East"
];

const IdeaWizard = () => {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    sector: '',
    technology: '',
    region: '',
    website: '',
    estimated_budget: ''
  });
  
  // State for current step
  const [currentStep, setCurrentStep] = useState<WizardStep>('generalInfo');
  
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset sector if category changes
    if (field === 'category') {
      setFormData(prev => ({
        ...prev,
        sector: ''
      }));
    }
  };
  
  // Move to next step
  const nextStep = () => {
    switch (currentStep) {
      case 'generalInfo':
        if (!formData.title || !formData.description) {
          toast.error('Please fill in all required fields');
          return;
        }
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('team');
        break;
      case 'team':
        setCurrentStep('budget');
        break;
      case 'budget':
        setCurrentStep('review');
        break;
      default:
        break;
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('generalInfo');
        break;
      case 'team':
        setCurrentStep('details');
        break;
      case 'budget':
        setCurrentStep('team');
        break;
      case 'review':
        setCurrentStep('budget');
        break;
      default:
        break;
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      await ideasApi.submitIdea({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        estimated_budget: formData.estimated_budget ? Number(formData.estimated_budget) : undefined,
        // Include additional fields
        metadata: {
          sector: formData.sector,
          technology: formData.technology,
          region: formData.region,
          website: formData.website
        }
      });
      
      toast.success('Your idea has been submitted successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Failed to submit idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get available sectors based on selected category
  const getAvailableSectors = () => {
    if (!formData.category || !sectors[formData.category as keyof typeof sectors]) {
      return ["Please select a category first"];
    }
    return sectors[formData.category as keyof typeof sectors];
  };
  
  // Calculate progress percentage
  const getProgress = () => {
    const steps = {
      'generalInfo': 0,
      'details': 25,
      'team': 50,
      'budget': 75,
      'review': 100
    };
    return steps[currentStep];
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'generalInfo':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">General Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Name <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your project name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">
                  Briefly describe your activity and products (in less than 25 words)
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your idea in short..."
                  rows={3}
                  required
                />
                <div className="text-right text-xs">
                  Words: <span className="font-bold">{formData.description.split(/\s+/).filter(Boolean).length}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Project/Company Website Link</Label>
                <Input
                  id="website"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Project Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  In which industry do you categorize your project?
                  <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">
                  In which sector do you categorize your project?
                  <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.sector} 
                  onValueChange={(value) => handleInputChange('sector', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger id="sector">
                    <SelectValue placeholder={
                      formData.category 
                        ? "Select a sector" 
                        : "Please select an industry first"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSectors().map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technology">
                  What type of technology do you use in your project?
                </Label>
                <Select 
                  value={formData.technology} 
                  onValueChange={(value) => handleInputChange('technology', value)}
                >
                  <SelectTrigger id="technology">
                    <SelectValue placeholder="Select a technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {["AI", "Big Data", "Blockchain", "IoT", "Cloud Computing", "Mobile", "Web", "Other"].map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">
                  In which region are you located?
                  <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.region} 
                  onValueChange={(value) => handleInputChange('region', value)}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 'team':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Team Information</h2>
            </div>
            
            <div className="space-y-4 py-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  In the future, this section will allow you to add information about your team members and their roles.
                  For now, you can proceed to the next step.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'budget':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Budget Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_budget">Estimated Budget ($)</Label>
                <Input
                  id="estimated_budget"
                  type="number"
                  placeholder="Enter estimated budget"
                  value={formData.estimated_budget}
                  onChange={(e) => handleInputChange('estimated_budget', e.target.value)}
                />
              </div>
              
              <div className="p-4 mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex-shrink-0 text-white text-center leading-8 rounded-full bg-blue-500 mr-3">i</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200 italic">
                    This information helps investors better understand the scale of your project.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Review Your Idea</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Project Name:</Label>
                  <div className="col-span-3">{formData.title}</div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Description:</Label>
                  <div className="col-span-3">{formData.description}</div>
                </div>
                
                {formData.website && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Website:</Label>
                    <div className="col-span-3">{formData.website}</div>
                  </div>
                )}
                
                {formData.category && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Industry:</Label>
                    <div className="col-span-3">{formData.category}</div>
                  </div>
                )}
                
                {formData.sector && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Sector:</Label>
                    <div className="col-span-3">{formData.sector}</div>
                  </div>
                )}
                
                {formData.technology && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Technology:</Label>
                    <div className="col-span-3">{formData.technology}</div>
                  </div>
                )}
                
                {formData.region && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Region:</Label>
                    <div className="col-span-3">{formData.region}</div>
                  </div>
                )}
                
                {formData.estimated_budget && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Budget:</Label>
                    <div className="col-span-3">${formData.estimated_budget}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Submit Your Idea</CardTitle>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 dark:bg-gray-700">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{width: `${getProgress()}%`}}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          <div className={`text-xs ${currentStep === 'generalInfo' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            General Info
          </div>
          <div className={`text-xs ${currentStep === 'details' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Details
          </div>
          <div className={`text-xs ${currentStep === 'team' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Team
          </div>
          <div className={`text-xs ${currentStep === 'budget' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Budget
          </div>
          <div className={`text-xs ${currentStep === 'review' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Review
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between p-6">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 'generalInfo'}
          className="w-32"
        >
          Previous
        </Button>
        
        {currentStep === 'review' ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-32"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            className="w-32"
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default IdeaWizard;
