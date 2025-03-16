
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, LightbulbIcon, ShieldCheck, User, DollarSign } from 'lucide-react';

const Index = () => {
  const [animationPlayed, setAnimationPlayed] = useState(false);

  // Start animation after a short delay
  setTimeout(() => {
    if (!animationPlayed) {
      setAnimationPlayed(true);
    }
  }, 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const features = [
    {
      title: 'Idea Holders',
      description: 'Submit your innovative ideas with detailed descriptions and attachments.',
      icon: <LightbulbIcon className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Experts',
      description: 'Estimate value and pricing for ideas with professional insights.',
      icon: <ShieldCheck className="h-10 w-10 text-emerald-500" />,
      color: 'bg-emerald-50',
    },
    {
      title: 'Investors',
      description: 'Discover and invest in promising ideas with complete copyright protection.',
      icon: <DollarSign className="h-10 w-10 text-amber-500" />,
      color: 'bg-amber-50',
    },
    {
      title: 'Administrators',
      description: 'Manage users and oversee the idea approval process.',
      icon: <User className="h-10 w-10 text-indigo-500" />,
      color: 'bg-indigo-50',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mb-6"
            >
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Connecting Ideas & Investors
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Turn Your <span className="text-primary">Innovative Ideas</span> into Reality
            </motion.h1>
            
            <motion.p
              className="mt-6 text-lg leading-8 text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              IdeaVest is a premium platform where idea creators connect with investors through a secure, transparent process, ensuring proper recognition and fair valuation.
            </motion.p>
            
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button asChild size="lg" className="text-sm h-11 px-6">
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-sm h-11">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="mt-16 sm:mt-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/10"></div>
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="IdeaVest Platform"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass p-6 rounded-lg max-w-lg text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Idea Marketplace</h2>
                  <p className="text-gray-700">Our platform ensures complete protection for both idea creators and investors through secure agreements and proper validation.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
              Platform Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Complete Ecosystem for Ideas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform caters to all stakeholders in the innovation process, from idea conception to investment.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={animationPlayed ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
              Simple Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How IdeaVest Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our streamlined process ensures that great ideas get recognized, valued, and funded.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-gray-200"></div>
            
            <div className="space-y-12 relative">
              {[
                {
                  title: "Submit Your Idea",
                  description: "Idea holders register and submit their innovations with detailed descriptions and any relevant attachments.",
                  step: "01",
                },
                {
                  title: "Expert Evaluation",
                  description: "Our expert panel reviews the submission and provides a detailed valuation and price estimation.",
                  step: "02",
                },
                {
                  title: "Admin Approval",
                  description: "Administrators verify the idea, ensure compliance with platform guidelines, and approve it for listing.",
                  step: "03",
                },
                {
                  title: "Investor Discovery",
                  description: "Approved ideas become visible to investors who can search and filter based on various criteria.",
                  step: "04",
                },
                {
                  title: "Secure Agreements",
                  description: "Interested investors sign a digital copyright agreement to access detailed idea information.",
                  step: "05",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <motion.div 
                      className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                          <span className="text-xs font-semibold tracking-wide text-primary uppercase mr-2">Step</span>
                          <span className="text-xl font-bold text-primary">{item.step}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-6 left-1/2 -ml-3">
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-primary border-4 border-white"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join our platform today and become part of an ecosystem that values innovation and creates opportunities for both idea creators and investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-primary">
                <Link to="/register">Sign Up Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
