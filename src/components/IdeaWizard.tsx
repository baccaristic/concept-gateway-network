import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ideasApi, paymentApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Upload, Link, FileVideo, Youtube, File, FileText, Paperclip } from 'lucide-react';
import { DocumentData, PaymentStatus } from '@/types';
import PaymentDialog from './PaymentDialog';

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
  
  // Add payment related states
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentPollInterval, setPaymentPollInterval] = useState<number | null>(null);
  
  // Payment amount
  const IDEA_SUBMISSION_FEE = 100; // $100 for idea submission
  
  // Poll for payment status if we have a payment reference
  useEffect(() => {
    if (paymentRef && paymentStatus !== 'COMPLETED' && !paymentPollInterval) {
      const interval = window.setInterval(async () => {
        try {
          const status = await paymentApi.getPaymentStatus(paymentRef);
          setPaymentStatus(status.status);
          
          if (status.status === 'COMPLETED') {
            // Clear the interval and submit the idea
            if (paymentPollInterval) {
              clearInterval(paymentPollInterval);
              setPaymentPollInterval(null);
            }
            
            toast.success("Payment successful!");
            await submitIdeaAfterPayment(paymentRef);
          } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
            // Clear the interval and show an error
            if (paymentPollInterval) {
              clearInterval(paymentPollInterval);
              setPaymentPollInterval(null);
            }
            
            toast.error("Payment was not successful. Please try again.");
            setPaymentRef(null);
            setPaymentUrl(null);
            setPaymentStatus(null);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 5000); // Check every 5 seconds
      
      setPaymentPollInterval(interval);
      
      // Clean up the interval when the component unmounts
      return () => {
        clearInterval(interval);
      };
    }
  }, [paymentRef, paymentStatus]);
  
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
  
  // Handle payment initiated
  const handlePaymentInitiated = (ref: string, url: string) => {
    setPaymentRef(ref);
    setPaymentUrl(url);
    setPaymentStatus('PENDING');
    setShowPaymentDialog(false);
    
    // Open payment URL in a new window
    window.open(url, '_blank');
    
    // Show toast message
    toast.info("Payment window opened. Please complete your payment.");
  };
  
  // Handle payment dialog cancel
  const handlePaymentCancel = () => {
    setShowPaymentDialog(false);
  };
  
  // Submit idea after payment
  const submitIdeaAfterPayment = async (paymentReference: string) => {
    try {
      setIsSubmitting(true);

      const idea = await ideasApi.submitIdea({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        estimatedBudget: formData.estimated_budget ? Number(formData.estimated_budget) : undefined,
        paymentRef: paymentReference, // Include payment reference
        additionalData: {
          sector: formData.sector,
          technology: formData.technology,
          region: formData.region,
          website: formData.website,
          innovation: {
            projectDescription: formData.project_description,
            problemStatement: formData.problem_statement,
            solution: formData.solution,
            innovationFactors: formData.innovation_factors,
            competitors: formData.competitors,
            differentiatingFactors: formData.differentiating_factors,
            businessModel: formData.business_model,
            growthPotential: formData.growth_potential,
            productVideoUrl: formData.product_video_url,
            productWebsite: formData.product_website,
            hasOtherProducts: formData.has_other_products
          },
          market: {
            targetMarket: formData.target_market,
            currentMarkets: currentMarkets,
            futureMarkets: futureMarkets,
            marketSize: formData.market_size,
            targetMarketShare: formData.target_market_share,
            growthStrategy: formData.growth_strategy,
            currentUsers: formData.current_users,
            projectedUsers: formData.projected_users
          },
          progress: {
            projectStage: formData.project_stage,
            currentProgress: formData.current_progress,
            joinedIncubator: formData.joined_incubator,
            wonEntrepreneurshipAward: formData.won_entrepreneurship_award,
            filedPatents: formData.filed_patents
          },
          team: {
            numberOfCofounders: formData.number_of_cofounders,
            teamDescription: formData.team_description,
            teamCapable: formData.team_capable,
            timeWorkingOnProject: formData.time_working_on_project,
            workedTogetherBefore: formData.worked_together_before,
            launchedStartupBefore: formData.launched_startup_before
          },
          presentation: {
            pitchVideoUrl: formData.pitch_video_url,
            pitchDeckUrl: '' // We'll handle pitch deck separately if needed
          },
          funding: {
            fundraisingGoal: formData.fundraising_goal,
            revenueProjection: formData.revenue_projection
          },
          additional: {
            whyApply: formData.why_apply,
            wantOtherBenefits: false, // Default value
            certifyInformation: formData.certify_information,
            acceptConditions: formData.accept_conditions,
            authorizeSharing: formData.authorize_sharing
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
  
  // Modified handle submit to initiate payment first
  const handleSubmit = async () => {
    // Show payment dialog
    setShowPaymentDialog(true);
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
