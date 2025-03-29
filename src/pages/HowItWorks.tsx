
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      title: "Submit Your Idea",
      description: "Register an account and submit your innovative idea with detailed descriptions, attachments, and any supporting materials.",
      icon: "📝",
    },
    {
      title: "Expert Evaluation",
      description: "Our panel of industry experts will review your submission and provide a detailed valuation and price estimation.",
      icon: "🔍",
    },
    {
      title: "Admin Approval",
      description: "Platform administrators verify the idea, ensure compliance with our guidelines, and approve it for listing.",
      icon: "✅",
    },
    {
      title: "Investor Discovery",
      description: "Approved ideas become visible to our network of investors who can search and filter based on their interests.",
      icon: "🔎",
    },
    {
      title: "Secure Agreements",
      description: "Interested investors sign a digital copyright agreement to access detailed information and begin discussions.",
      icon: "🔒",
    }
  ];
  
  const benefits = [
    "Complete intellectual property protection",
    "Fair valuation by industry experts",
    "Access to a global network of investors",
    "Secure digital agreements and contracts",
    "Guidance throughout the entire process",
    "Transparent communication channels"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              How IdeaVest Works
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Our streamlined process ensures that great ideas get recognized, valued, and funded through a secure and transparent platform.
            </p>
            <Button asChild size="lg">
              <Link to="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Simple Process</h2>
            <p className="text-lg text-gray-600">
              We've designed a streamlined journey from idea submission to investor connection
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden sm:block"></div>
              
              {/* Timeline steps */}
              <div className="space-y-16">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className={`relative flex flex-col sm:flex-row ${index % 2 === 0 ? 'sm:text-right' : 'sm:flex-row-reverse sm:text-left'} gap-8`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Content */}
                    <div className="flex-1 sm:w-1/2">
                      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full">
                        <div className="text-3xl mb-4">{step.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline marker */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
                      <div className="w-10 h-10 rounded-full bg-primary border-4 border-white flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Empty space for alignment */}
                    <div className="flex-1 sm:w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of Using IdeaVest</h2>
            <p className="text-lg text-gray-600">
              Our platform offers unique advantages for both idea creators and investors
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex items-start p-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mr-4 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <p className="text-gray-800 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 mb-8">
              Join our platform today and become part of an ecosystem that values innovation and creates opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/register">Create an Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
