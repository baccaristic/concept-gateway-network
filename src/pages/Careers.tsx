
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ArrowRight, BriefcaseIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Careers = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'product', name: 'Product & Design' },
    { id: 'operations', name: 'Operations' },
    { id: 'marketing', name: 'Marketing & Communications' },
    { id: 'finance', name: 'Finance & Legal' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'sf', name: 'San Francisco, CA' },
    { id: 'ny', name: 'New York, NY' },
    { id: 'remote', name: 'Remote' }
  ];

  // Sample job listings
  const jobListings = [
    {
      id: 1,
      title: "Senior Full Stack Engineer",
      department: "engineering",
      type: "Full-time",
      location: "San Francisco, CA",
      locationId: "sf",
      description: "Join our engineering team to build and maintain our core platform features. You'll work on both frontend and backend systems using modern technologies.",
      requirements: [
        "5+ years of experience with modern web frameworks (React, Angular, or Vue)",
        "Strong proficiency in JavaScript/TypeScript",
        "Experience with Node.js and RESTful APIs",
        "Experience with database systems (SQL and NoSQL)",
        "Bachelor's degree in Computer Science or equivalent experience"
      ]
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "product",
      type: "Full-time",
      location: "New York, NY",
      locationId: "ny",
      description: "Create intuitive, engaging experiences for our users. You'll collaborate with product managers and engineers to design features that delight our users.",
      requirements: [
        "3+ years of experience in product design",
        "Strong portfolio showcasing web and mobile application design",
        "Proficiency in design tools such as Figma or Sketch",
        "Experience with user research and usability testing",
        "Excellent communication and collaboration skills"
      ]
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "marketing",
      type: "Full-time",
      location: "San Francisco, CA",
      locationId: "sf",
      description: "Lead our marketing initiatives to grow our user base and build our brand. You'll develop strategies across multiple channels to reach idea creators and investors.",
      requirements: [
        "4+ years of experience in B2B marketing",
        "Experience with digital marketing channels and campaigns",
        "Strong analytical skills and data-driven approach",
        "Excellent project management and organizational skills",
        "Bachelor's degree in Marketing, Business, or related field"
      ]
    },
    {
      id: 4,
      title: "Content Writer",
      department: "marketing",
      type: "Part-time",
      location: "Remote",
      locationId: "remote",
      description: "Create compelling content for our blog, social media, and marketing materials. You'll help educate our audience about innovation, entrepreneurship, and investing.",
      requirements: [
        "2+ years of content writing experience",
        "Strong understanding of SEO principles",
        "Excellent research and storytelling skills",
        "Ability to translate complex topics into engaging content",
        "Portfolio of published work"
      ]
    },
    {
      id: 5,
      title: "Financial Analyst",
      department: "finance",
      type: "Full-time",
      location: "New York, NY",
      locationId: "ny",
      description: "Support our finance team with financial modeling, reporting, and analysis. You'll help ensure the financial health of the company and provide insights for strategic decisions.",
      requirements: [
        "3+ years of experience in financial analysis",
        "Strong Excel and financial modeling skills",
        "Experience with financial reporting and budgeting",
        "Knowledge of accounting principles",
        "Bachelor's degree in Finance, Accounting, or related field"
      ]
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "operations",
      type: "Full-time",
      location: "Remote",
      locationId: "remote",
      description: "Ensure the success of our users by providing exceptional support and guidance. You'll work with idea creators and investors to help them get the most out of our platform.",
      requirements: [
        "3+ years of customer success or account management experience",
        "Strong communication and interpersonal skills",
        "Problem-solving ability and attention to detail",
        "Experience with CRM systems",
        "Bachelor's degree or equivalent experience"
      ]
    }
  ];

  // Filter job listings based on search query, department, and location
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.locationId === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const benefits = [
    {
      title: "Competitive Compensation",
      description: "We offer competitive salaries and equity packages to ensure you share in the company's success."
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance for you and your dependents."
    },
    {
      title: "Flexible Work",
      description: "We offer remote and hybrid work options with flexible hours to help you maintain work-life balance."
    },
    {
      title: "Professional Development",
      description: "Learning stipends and opportunities for conferences, courses, and skill development."
    },
    {
      title: "Generous Time Off",
      description: "Unlimited PTO policy, paid holidays, and paid parental leave."
    },
    {
      title: "Team Events",
      description: "Regular team-building events, retreats, and social activities to foster collaboration."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Help us build the future of innovation and investment. Explore career opportunities at IdeaVest.
            </p>
            <Button asChild size="lg">
              <a href="#job-listings">View Open Positions</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Our Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">Why Work With Us</h2>
                <p className="text-muted-foreground mb-4">
                  At IdeaVest, we're building the platform that connects innovative ideas with the resources needed to bring them to life. Our team is passionate about empowering creators and fostering a global ecosystem of innovation.
                </p>
                <p className="text-muted-foreground mb-4">
                  We value collaboration, creativity, and impact. Every team member plays a crucial role in our mission to democratize access to funding and support for groundbreaking ideas.
                </p>
                <p className="text-muted-foreground">
                  If you're excited about working in a fast-paced environment where your contributions directly impact thousands of innovators and investors worldwide, we want to hear from you.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="IdeaVest team collaborating" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-lg bg-primary/10 -z-10"></div>
                <div className="absolute -top-6 -left-6 w-40 h-40 rounded-lg bg-primary/5 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Benefits & Perks</h2>
            <p className="text-lg text-muted-foreground">
              We offer a comprehensive benefits package to support your well-being and professional growth.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="job-listings" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Open Positions</h2>
            
            {/* Search and filters */}
            <div className="mb-8 space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">Department</label>
                  <select
                    id="department"
                    className="w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">Location</label>
                  <select
                    id="location"
                    className="w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Job listings */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`job-${job.id}`} className="border-none">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                          <div>
                            <div className="flex items-center mb-2">
                              <BriefcaseIcon className="h-5 w-5 text-primary mr-2" />
                              <h3 className="text-xl font-semibold text-card-foreground">{job.title}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant="outline">{job.type}</Badge>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{job.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 sm:mt-0 flex items-center">
                            <AccordionTrigger className="py-0 [&[data-state=open]]:text-primary">
                              See Details
                            </AccordionTrigger>
                          </div>
                        </div>
                        
                        <AccordionContent className="px-6 pb-6 pt-0">
                          <div className="border-t border-border pt-4">
                            <p className="text-card-foreground mb-4">{job.description}</p>
                            
                            <h4 className="font-medium text-card-foreground mb-2">Requirements:</h4>
                            <ul className="list-disc pl-5 mb-6 space-y-1">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="text-muted-foreground">{req}</li>
                              ))}
                            </ul>
                            
                            <Button className="w-full sm:w-auto">
                              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-4">No job openings match your criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDepartment('all');
                      setSelectedLocation('all');
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Don't See a Perfect Fit?</h2>
            <p className="text-lg opacity-90 mb-8">
              We're always looking for talented individuals to join our team. Send us your resume, and we'll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <a href="mailto:careers@ideavest.com">Submit Your Resume</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Recruiting</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
