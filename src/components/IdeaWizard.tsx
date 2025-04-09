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
import { Switch } from '@/components/ui/switch';
import { Upload, Link, FileVideo, Youtube, File, FileText, Paperclip } from 'lucide-react';
import { DocumentData } from '@/types';

// Define step types for strong typing
type WizardStep = 'generalInfo' | 'details' | 'innovation' | 'team' | 'budget' | 'documents' | 'review';

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

// Define project stages
const projectStages = [
  "Idea",
  "Prototype",
  "MVP",
  "Early Sales",
  "Growth"
];

// Define market types
const marketTypes = [
  "B2B",
  "B2C",
  "B2B2C",
  "B2G",
  "C2C",
  "Other"
];

// Define countries list (simplified)
const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "France",
  "Germany",
  "China",
  "Japan",
  "India",
  "Brazil",
  "Australia",
  "South Africa",
  "Other"
];

const IdeaWizard = () => {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    // General Info
    title: '',
    description: '',
    category: '',
    sector: '',
    technology: '',
    region: '',
    website: '',
    estimated_budget: '',
    
    // Innovation & Scalability
    project_description: '',
    problem_statement: '',
    solution: '',
    innovation_factors: '',
    competitors: '',
    differentiating_factors: '',
    business_model: '',
    growth_potential: '',
    product_video_url: '',
    product_website: '',
    has_other_products: false,
    
    // Market Info
    target_market: '',
    market_size: '',
    target_market_share: '',
    growth_strategy: '',
    current_users: '',
    projected_users: '',
    
    // Progress
    project_stage: '',
    current_progress: '',
    joined_incubator: false,
    won_entrepreneurship_award: false,
    filed_patents: false,
    
    // Founding Team
    number_of_cofounders: '',
    team_description: '',
    team_capable: false,
    time_working_on_project: '',
    worked_together_before: false,
    launched_startup_before: false,
    
    // Presentation
    pitch_video_url: '',
    
    // Funding
    fundraising_goal: '',
    revenue_projection: '',
    
    // Additional Info
    why_apply: '',
    certify_information: false,
    accept_conditions: false,
    authorize_sharing: false
  });

  // Add state for file uploads
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  
  // State for target markets (repeatable form)
  const [currentMarkets, setCurrentMarkets] = useState<Array<{
    target: string;
    country: string;
    year: string;
    marketType: string;
  }>>([{ target: '', country: '', year: '', marketType: '' }]);
  
  // State for future markets (repeatable form)
  const [futureMarkets, setFutureMarkets] = useState<Array<{
    target: string;
    country: string;
    year: string;
    marketType: string;
  }>>([{ target: '', country: '', year: '', marketType: '' }]);
  
  // State for current step
  const [currentStep, setCurrentStep] = useState<WizardStep>('generalInfo');
  
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newDocuments: DocumentData[] = Array.from(files).map(file => ({
      name: file.name,
      file: file,
      type: file.type,
      size: file.size,
      description: ''
    }));
    
    setDocuments([...documents, ...newDocuments]);
    
    // Reset file input
    event.target.value = '';
  };
  
  // Remove document
  const removeDocument = (index: number) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setDocuments(updatedDocs);
  };
  
  // Update document description
  const updateDocumentDescription = (index: number, description: string) => {
    const updatedDocs = [...documents];
    updatedDocs[index].description = description;
    setDocuments(updatedDocs);
  };
  
  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
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
  
  // Handle current markets changes
  const handleCurrentMarketChange = (index: number, field: string, value: string) => {
    const updatedMarkets = [...currentMarkets];
    updatedMarkets[index] = { ...updatedMarkets[index], [field]: value };
    setCurrentMarkets(updatedMarkets);
  };
  
  // Add a new current market
  const addCurrentMarket = () => {
    setCurrentMarkets([...currentMarkets, { target: '', country: '', year: '', marketType: '' }]);
  };
  
  // Remove a current market
  const removeCurrentMarket = (index: number) => {
    const updatedMarkets = [...currentMarkets];
    updatedMarkets.splice(index, 1);
    setCurrentMarkets(updatedMarkets);
  };
  
  // Handle future markets changes
  const handleFutureMarketChange = (index: number, field: string, value: string) => {
    const updatedMarkets = [...futureMarkets];
    updatedMarkets[index] = { ...updatedMarkets[index], [field]: value };
    setFutureMarkets(updatedMarkets);
  };
  
  // Add a new future market
  const addFutureMarket = () => {
    setFutureMarkets([...futureMarkets, { target: '', country: '', year: '', marketType: '' }]);
  };
  
  // Remove a future market
  const removeFutureMarket = (index: number) => {
    const updatedMarkets = [...futureMarkets];
    updatedMarkets.splice(index, 1);
    setFutureMarkets(updatedMarkets);
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
        setCurrentStep('innovation');
        break;
      case 'innovation':
        setCurrentStep('team');
        break;
      case 'team':
        setCurrentStep('budget');
        break;
      case 'budget':
        setCurrentStep('documents');
        break;
      case 'documents':
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
      case 'innovation':
        setCurrentStep('details');
        break;
      case 'team':
        setCurrentStep('innovation');
        break;
      case 'budget':
        setCurrentStep('team');
        break;
      case 'documents':
        setCurrentStep('budget');
        break;
      case 'review':
        setCurrentStep('documents');
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
        estimatedBudget: formData.estimated_budget ? Number(formData.estimated_budget) : undefined,
        additional_data: {
          sector: formData.sector,
          technology: formData.technology,
          region: formData.region,
          website: formData.website,
          innovation: {
            project_description: formData.project_description,
            problem_statement: formData.problem_statement,
            solution: formData.solution,
            innovation_factors: formData.innovation_factors,
            competitors: formData.competitors,
            differentiating_factors: formData.differentiating_factors,
            business_model: formData.business_model,
            growth_potential: formData.growth_potential,
            product_video_url: formData.product_video_url,
            product_website: formData.product_website,
            has_other_products: formData.has_other_products
          },
          market: {
            target_market: formData.target_market,
            current_markets: currentMarkets,
            future_markets: futureMarkets,
            market_size: formData.market_size,
            target_market_share: formData.target_market_share,
            growth_strategy: formData.growth_strategy,
            current_users: formData.current_users,
            projected_users: formData.projected_users
          },
          progress: {
            project_stage: formData.project_stage,
            current_progress: formData.current_progress,
            joined_incubator: formData.joined_incubator,
            won_entrepreneurship_award: formData.won_entrepreneurship_award,
            filed_patents: formData.filed_patents
          },
          team: {
            number_of_cofounders: formData.number_of_cofounders,
            team_description: formData.team_description,
            team_capable: formData.team_capable,
            time_working_on_project: formData.time_working_on_project,
            worked_together_before: formData.worked_together_before,
            launched_startup_before: formData.launched_startup_before
          },
          presentation: {
            pitch_video_url: formData.pitch_video_url,
            pitch_deck_url: '' // We'll handle pitch deck separately if needed
          },
          funding: {
            fundraising_goal: formData.fundraising_goal,
            revenue_projection: formData.revenue_projection
          },
          additional: {
            why_apply: formData.why_apply,
            want_other_benefits: false, // Default value
            certify_information: formData.certify_information,
            accept_conditions: formData.accept_conditions,
            authorize_sharing: formData.authorize_sharing
          }
        }
      });
      
      // If there are documents to upload, we could handle them here
      // But this would need to be implemented after idea creation
      // This would require the backend to support uploading documents to an existing idea
      if (documents.length > 0) {
        toast.info('Uploading documents...');
        // We would need to loop through each document and upload it
        // This is just a placeholder for potential future implementation
        // for (const doc of documents) {
        //   await ideasApi.uploadAttachment(ideaId, doc.file, doc.description);
        // }
      }
      
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
      'details': 16,
      'innovation': 32,
      'team': 48,
      'budget': 64,
      'documents': 80,
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

      case 'innovation':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Value Proposition & Innovation</h2>
            </div>
            
            <div className="space-y-4">
              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="project_description">
                  Project Description
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="project_description"
                  value={formData.project_description}
                  onChange={(e) => handleInputChange('project_description', e.target.value)}
                  placeholder="Provide a comprehensive description of your project"
                  rows={3}
                />
              </div>
              
              {/* Problem Statement */}
              <div className="space-y-2">
                <Label htmlFor="problem_statement">
                  Problem Statement
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="problem_statement"
                  value={formData.problem_statement}
                  onChange={(e) => handleInputChange('problem_statement', e.target.value)}
                  placeholder="What problem are you trying to solve?"
                  rows={3}
                />
              </div>
              
              {/* Solution */}
              <div className="space-y-2">
                <Label htmlFor="solution">
                  Solution
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  placeholder="How does your product/service solve this problem?"
                  rows={3}
                />
              </div>
              
              {/* Innovation Factors */}
              <div className="space-y-2">
                <Label htmlFor="innovation_factors">
                  Why Is Your Solution Innovative?
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="innovation_factors"
                  value={formData.innovation_factors}
                  onChange={(e) => handleInputChange('innovation_factors', e.target.value)}
                  placeholder="Explain what makes your solution innovative"
                  rows={3}
                />
              </div>
              
              {/* Competitors */}
              <div className="space-y-2">
                <Label htmlFor="competitors">
                  Potential Competitors
                </Label>
                <Textarea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange('competitors', e.target.value)}
                  placeholder="List your main competitors"
                  rows={3}
                />
              </div>
              
              {/* Differentiating Factors */}
              <div className="space-y-2">
                <Label htmlFor="differentiating_factors">
                  What Are The Differentiating Factors Of Your Solution?
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="differentiating_factors"
                  value={formData.differentiating_factors}
                  onChange={(e) => handleInputChange('differentiating_factors', e.target.value)}
                  placeholder="What gives you a competitive advantage?"
                  rows={3}
                />
              </div>
              
              {/* Business Model */}
              <div className="space-y-2">
                <Label htmlFor="business_model">
                  How Do You Plan To Make Money? What Is Your Business Model?
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="business_model"
                  value={formData.business_model}
                  onChange={(e) => handleInputChange('business_model', e.target.value)}
                  placeholder="Describe your revenue streams and business model"
                  rows={3}
                />
              </div>
              
              {/* Growth Potential */}
              <div className="space-y-2">
                <Label htmlFor="growth_potential">
                  Describe The Growth Potential Of Your Project, Key Indicators And Success Factors
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="growth_potential"
                  value={formData.growth_potential}
                  onChange={(e) => handleInputChange('growth_potential', e.target.value)}
                  placeholder="Explain how your project can scale and what metrics you'll use to measure success"
                  rows={3}
                />
              </div>
              
              {/* Product Video */}
              <div className="space-y-2">
                <Label htmlFor="product_video_url" className="flex items-center gap-2">
                  <FileVideo className="h-4 w-4" /> Upload A Video Showing Your Product/Prototype
                </Label>
                <Input
                  id="product_video_url"
                  value={formData.product_video_url}
                  onChange={(e) => handleInputChange('product_video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1"
                />
              </div>
              
              {/* Product Website */}
              <div className="space-y-2">
                <Label htmlFor="product_website" className="flex items-center gap-2">
                  <Link className="h-4 w-4" /> Link To Your Product/Website/Application
                </Label>
                <Input
                  id="product_website"
                  value={formData.product_website}
                  onChange={(e) => handleInputChange('product_website', e.target.value)}
                  placeholder="https://www.example.com"
                />
              </div>
              
              {/* Other Products */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_other_products"
                  checked={formData.has_other_products as boolean}
                  onCheckedChange={(checked) => handleInputChange('has_other_products', checked)}
                />
                <Label htmlFor="has_other_products">
                  Does your company have other products or services besides those in this application?
                  <span className="text-red-500">*</span>
                </Label>
              </div>
            </div>

            {/* Market Section */}
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Market</h2>
            </div>
            
            <div className="space-y-4">
              {/* Target Market */}
              <div className="space-y-2">
                <Label htmlFor="target_market">
                  What Is Your Target Market?
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="target_market"
                  value={formData.target_market}
                  onChange={(e) => handleInputChange('target_market', e.target.value)}
                  placeholder="Describe your target customers and market segments"
                  rows={3}
                />
              </div>
              
              {/* Current Markets */}
              <div className="space-y-4">
                <Label>
                  In Which Countries Do You Currently Sell Your Products/Solutions?
                </Label>
                
                {currentMarkets.map((market, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-md">
                    <div>
                      <Label htmlFor={`current-target-${index}`}>Target</Label>
                      <Input
                        id={`current-target-${index}`}
                        value={market.target}
                        onChange={(e) => handleCurrentMarketChange(index, 'target', e.target.value)}
                        placeholder="Target audience"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`current-country-${index}`}>Country</Label>
                      <Select 
                        value={market.country} 
                        onValueChange={(value) => handleCurrentMarketChange(index, 'country', value)}
                      >
                        <SelectTrigger id={`current-country-${index}`}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`current-year-${index}`}>Year</Label>
                      <Input
                        id={`current-year-${index}`}
                        value={market.year}
                        onChange={(e) => handleCurrentMarketChange(index, 'year', e.target.value)}
                        placeholder="Entry year"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`current-market-type-${index}`}>Market Type</Label>
                      <Select 
                        value={market.marketType} 
                        onValueChange={(value) => handleCurrentMarketChange(index, 'marketType', value)}
                      >
                        <SelectTrigger id={`current-market-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {index > 0 && (
                      <Button 
                        variant="destructive" 
                        className="mt-2"
                        onClick={() => removeCurrentMarket(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={addCurrentMarket}
                  className="flex items-center gap-2 mt-2"
                >
                  <Upload className="h-4 w-4" /> Add Another Market
                </Button>
              </div>
              
              {/* Future Markets */}
              <div className="space-y-4">
                <Label>
                  In Which Countries Do You Plan To Sell Your Products In The Short Term?
                </Label>
                
                {futureMarkets.map((market, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-md">
                    <div>
                      <Label htmlFor={`future-target-${index}`}>Target</Label>
                      <Input
                        id={`future-target-${index}`}
                        value={market.target}
                        onChange={(e) => handleFutureMarketChange(index, 'target', e.target.value)}
                        placeholder="Target audience"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`future-country-${index}`}>Country</Label>
                      <Select 
                        value={market.country} 
                        onValueChange={(value) => handleFutureMarketChange(index, 'country', value)}
                      >
                        <SelectTrigger id={`future-country-${index}`}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`future-year-${index}`}>Year</Label>
                      <Input
                        id={`future-year-${index}`}
                        value={market.year}
                        onChange={(e) => handleFutureMarketChange(index, 'year', e.target.value)}
                        placeholder="Planned year"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`future-market-type-${index}`}>Market Type</Label>
                      <Select 
                        value={market.marketType} 
                        onValueChange={(value) => handleFutureMarketChange(index, 'marketType', value)}
                      >
                        <SelectTrigger id={`future-market-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {index > 0 && (
                      <Button 
                        variant="destructive" 
                        className="mt-2"
                        onClick={() => removeFutureMarket(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={addFutureMarket}
                  className="flex items-center gap-2 mt-2"
                >
                  <Upload className="h-4 w-4" /> Add Another Market
                </Button>
              </div>
              
              {/* Market Size */}
              <div className="space-y-2">
                <Label htmlFor="market_size">
                  What Is The Size Of Your Market?
                </Label>
                <Textarea
                  id="market_size"
                  value={formData.market_size}
                  onChange={(e) => handleInputChange('market_size', e.target.value)}
                  placeholder="Quantify your total addressable market"
                  rows={2}
                />
              </div>
              
              {/* Target Market Share */}
              <div className="space-y-2">
                <Label htmlFor="target_market_share">
                  What Is Your Target Market Share? And How Do You Plan To Achieve It?
                </Label>
                <Textarea
                  id="target_market_share"
                  value={formData.target_market_share}
                  onChange={(e) => handleInputChange('target_market_share', e.target.value)}
                  placeholder="What percentage of the market do you aim to capture and how?"
                  rows={2}
                />
              </div>
              
              {/* Growth Strategy */}
              <div className="space-y-2">
                <Label htmlFor="growth_strategy">
                  What Is Your Growth Strategy For The Next 3 Years? (In Numbers)
                </Label>
                <Textarea
                  id="growth_strategy"
                  value={formData.growth_strategy}
                  onChange={(e) => handleInputChange('growth_strategy', e.target.value)}
                  placeholder="Provide quantitative growth projections"
                  rows={2}
                />
              </div>
              
              {/* Current Users */}
              <div className="space-y-2">
                <Label htmlFor="current_users">
                  How Many Users Do You Have Today? What Is Your Projection For The Next 3 Years?
                </Label>
                <Textarea
                  id="current_users"
                  value={formData.current_users}
                  onChange={(e) => handleInputChange('current_users', e.target.value)}
                  placeholder="Current user base and growth projections"
                  rows={2}
                />
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
                  In the future, this section will allow you to add more detailed information about your team members and their roles.
                  For now, you can provide basic team information below.
                </p>
              </div>
              
              {/* Project Stage */}
              <div className="space-y-2 mt-6">
                <Label htmlFor="project_stage">
                  What Stage Is Your Project At?
                  <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.project_stage} 
                  onValueChange={(value) => handleInputChange('project_stage', value)}
                >
                  <SelectTrigger id="project_stage">
                    <SelectValue placeholder="Select project stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Current Progress */}
              <div className="space-y-2">
                <Label htmlFor="current_progress">
                  Please Detail The Current Progress Of Your Project (Product, Market, Partners...)
                </Label>
                <Textarea
                  id="current_progress"
                  value={formData.current_progress}
                  onChange={(e) => handleInputChange('current_progress', e.target.value)}
                  placeholder="Describe your project's current status"
                  rows={3}
                />
              </div>
              
              {/* Incubator */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="joined_incubator"
                  checked={formData.joined_incubator as boolean}
                  onCheckedChange={(checked) => handleInputChange('joined_incubator', checked)}
                />
                <Label htmlFor="joined_incubator">
                  Have you participated in an acceleration/incubation/support program?
                </Label>
              </div>
              
              {/* Entrepreneurship Award */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="won_entrepreneurship_award"
                  checked={formData.won_entrepreneurship_award as boolean}
                  onCheckedChange={(checked) => handleInputChange('won_entrepreneurship_award', checked)}
                />
                <Label htmlFor="won_entrepreneurship_award">
                  Have you ever won an entrepreneurship award?
                </Label>
              </div>
              
              {/* Patents */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="filed_patents"
                  checked={formData.filed_patents as boolean}
                  onCheckedChange={(checked) => handleInputChange('filed_patents', checked)}
                />
                <Label htmlFor="filed_patents">
                  Have you filed any patents?
                </Label>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <h3 className="text-primary font-semibold mb-4">Founding Team</h3>
                
                {/* Number of Co-founders */}
                <div className="space-y-2">
                  <Label htmlFor="number_of_cofounders">
                    How Many Co-founders Are There?
                  </Label>
                  <Input
                    id="number_of_cofounders"
                    type="number"
                    value={formData.number_of_cofounders}
                    onChange={(e) => handleInputChange('number_of_cofounders', e.target.value)}
                    placeholder="Enter number"
                    min="1"
                  />
                </div>
                
                {/* Team Description */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="team_description">
                    Describe Your Founding Team
                  </Label>
                  <Textarea
                    id="team_description"
                    value={formData.team_description}
                    onChange={(e) => handleInputChange('team_description', e.target.value)}
                    placeholder="Describe the backgrounds, skills, and roles of your founding team"
                    rows={3}
                  />
                </div>
                
                {/* Team Capable */}
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    id="team_capable"
                    checked={formData.team_capable as boolean}
                    onCheckedChange={(checked) => handleInputChange('team_capable', checked)}
                  />
                  <Label htmlFor="team_capable">
                    Do you think your current team is able to execute your project well?
                  </Label>
                </div>
                
                {/* Time Working on Project */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="time_working_on_project">
                    How Long Have You Been Working On The Project? Full-time Or Part-time?
                  </Label>
                  <Input
                    id="time_working_on_project"
                    value={formData.time_working_on_project}
                    onChange={(e) => handleInputChange('time_working_on_project', e.target.value)}
                    placeholder="e.g., 6 months, full-time"
                  />
                </div>
                
                {/* Worked Together Before */}
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    id="worked_together_before"
                    checked={formData.worked_together_before as boolean}
                    onCheckedChange={(checked) => handleInputChange('worked_together_before', checked)}
                  />
                  <Label htmlFor="worked_together_before">
                    Have you worked together on other projects?
                  </Label>
                </div>
                
                {/* Launched Startup Before */}
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    id="launched_startup_before"
                    checked={formData.launched_startup_before as boolean}
                    onCheckedChange={(checked) => handleInputChange('launched_startup_before', checked)}
                  />
                  <Label htmlFor="launched_startup_before">
                    Have you launched a startup before?
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'budget':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Budget & Presentation</h2>
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
              
              {/* Fundraising Goal */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="fundraising_goal">
                  How Much Funding Do You Plan To Raise Over The Next 3 Years?
                </Label>
                <Input
                  id="fundraising_goal"
                  type="number"
                  value={formData.fundraising_goal}
                  onChange={(e) => handleInputChange('fundraising_goal', e.target.value)}
                  placeholder="Amount in USD"
                />
              </div>
              
              {/* Revenue Projection */}
              <div className="space-y-2">
                <Label htmlFor="revenue_projection">
                  How Much Revenue Do You Plan To Generate Over The Next 3 Years?
                </Label>
                <Input
                  id="revenue_projection"
                  type="number"
                  value={formData.revenue_projection}
                  onChange={(e) => handleInputChange('revenue_projection', e.target.value)}
                  placeholder="Amount in USD"
                />
              </div>
              
              {/* Pitch Video */}
              <div className="space-y-2 mt-6">
                <Label htmlFor="pitch_video_url" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" /> Link To A YouTube Video (Max 3 Minutes) Presenting Your Startup
                </Label>
                <Input
                  id="pitch_video_url"
                  value={formData.pitch_video_url}
                  onChange={(e) => handleInputChange('pitch_video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Include innovative aspects, growth potential, and team strengths in your pitch video
                </p>
              </div>
              
              {/* Legal Agreement */}
              <div className="space-y-4 mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                <h3 className="font-medium">Legal Agreement</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="certify_information"
                    checked={formData.certify_information as boolean}
                    onCheckedChange={(checked) => handleInputChange('certify_information', checked)}
                  />
                  <Label htmlFor="certify_information">
                    I certify the accuracy of the information provided
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="accept_conditions"
                    checked={formData.accept_conditions as boolean}
                    onCheckedChange={(checked) => handleInputChange('accept_conditions', checked)}
                  />
                  <Label htmlFor="accept_conditions">
                    I accept the idea submission conditions
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="authorize_sharing"
                    checked={formData.authorize_sharing as boolean}
                    onCheckedChange={(checked) => handleInputChange('authorize_sharing', checked)}
                  />
                  <Label htmlFor="authorize_sharing">
                    I authorize sharing my contact information for startup opportunities
                  </Label>
                </div>
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

      case 'documents':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary text-lg font-bold mb-5 pb-2 py-6 border-primary/30 border-b">Supporting Documents</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex-shrink-0 text-white text-center leading-8 rounded-full bg-blue-500 mr-3">i</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    Upload any supporting documents that help explain your idea. This can include business plans, presentations, diagrams, prototypes, or any other relevant material.
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="flex items-center gap-2 mb-4">
                  <Paperclip className="h-4 w-4" /> Upload Documents
                </Label>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <FileText className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your files here, or click to browse
                    </p>
                    
                    <Input 
                      type="file" 
                      id="document-upload" 
                      className="hidden"
                      onChange={handleDocumentUpload}
                      multiple
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('document-upload')?.click()}
                      className="mx-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" /> Browse Files
                    </Button>
                  </div>
                </div>
                
                {documents.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-4">Uploaded Documents ({documents.length})</h3>
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="flex items-center gap-3 mb-3 md:mb-0">
                            <File className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(doc.size / 1024).toFixed(2)} KB • {doc.type.split('/')[1]}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 items-center">
                            <Input 
                              placeholder="Add description (optional)"
                              value={doc.description || ''}
                              onChange={e => updateDocumentDescription(index, e.target.value)}
                              className="max-w-[200px]"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex-shrink-0 text-white text-center leading-8 rounded-full bg-yellow-500 mr-3">!</div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    Maximum file size: 10MB per document. Supported formats: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, JPEG.
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
                
                {formData.solution && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Solution:</Label>
                    <div className="col-span-3">{formData.solution}</div>
                  </div>
                )}
                
                {formData.project_stage && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Project Stage:</Label>
                    <div className="col-span-3">{formData.project_stage}</div>
                  </div>
                )}
                
                {documents.length > 0 && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold">Documents:</Label>
                    <div className="col-span-3">
                      <ul className="list-disc pl-5">
                        {documents.map((doc, index) => (
                          <li key={index}>{doc.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {!formData.certify_information && (
                  <div className="col-span-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Please certify the accuracy of your information before submission.
                    </p>
                  </div>
                )}
                
                {!formData.accept_conditions && (
                  <div className="col-span-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Please accept the idea submission conditions before proceeding.
                    </p>
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
          <div className={`text-xs ${currentStep === 'innovation' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Innovation
          </div>
          <div className={`text-xs ${currentStep === 'team' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Team
          </div>
          <div className={`text-xs ${currentStep === 'budget' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Budget
          </div>
          <div className={`text-xs ${currentStep === 'documents' ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Documents
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
            disabled={isSubmitting || !formData.certify_information || !formData.accept_conditions}
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
