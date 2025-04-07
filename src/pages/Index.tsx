
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, LightbulbIcon, ShieldCheck, User, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [content, setContent] = useState({});
  const [features, setFeatures] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Start animation after a short delay
  setTimeout(() => {
    if (!animationPlayed) {
      setAnimationPlayed(true);
    }
  }, 100);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Fetch page content
        const { data: contentData, error: contentError } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_name', 'home');
          
        if (contentError) throw contentError;
        
        // Fetch features
        const { data: featuresData, error: featuresError } = await supabase
          .from('homepage_features')
          .select('*')
          .order('display_order', { ascending: true });
          
        if (featuresError) throw featuresError;
        
        // Fetch steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('homepage_steps')
          .select('*')
          .order('display_order', { ascending: true });
          
        if (stepsError) throw stepsError;
        
        // Process content into a more usable structure
        const contentMap = {};
        contentData.forEach(item => {
          if (!contentMap[item.section_name]) {
            contentMap[item.section_name] = {};
          }
          contentMap[item.section_name][item.content_key] = {
            value: item.content_value,
            type: item.content_type
          };
        });
        
        setContent(contentMap);
        setFeatures(featuresData);
        setSteps(stepsData);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

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

  // Get content with fallback
  const getContent = (section, key, defaultValue = '') => {
    if (content[section] && content[section][key]) {
      return content[section][key].value;
    }
    return defaultValue;
  };

  // Render HTML content safely
  const renderHtml = (html) => {
    return { __html: html };
  };

  // Get icon component by name
  const getIconByName = (name) => {
    const icons = {
      'LightbulbIcon': <LightbulbIcon className="h-10 w-10 text-blue-500" />,
      'ShieldCheck': <ShieldCheck className="h-10 w-10 text-emerald-500" />,
      'DollarSign': <DollarSign className="h-10 w-10 text-amber-500" />,
      'User': <User className="h-10 w-10 text-indigo-500" />
    };
    
    return icons[name] || <LightbulbIcon className="h-10 w-10 text-blue-500" />;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 sm:pt-24">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]"></div>
        
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
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/30">
                Connecting Ideas & Investors
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              dangerouslySetInnerHTML={renderHtml(getContent('hero', 'headline', 'Turn Your <span class="text-primary">Innovative Ideas</span> into Reality'))}
            />
            
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {getContent('hero', 'subheadline', 'IdeaVest is a premium platform where idea creators connect with investors through a secure, transparent process, ensuring proper recognition and fair valuation.')}
            </motion.p>
            
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button asChild size="lg" className="text-sm h-11 px-6">
                <Link to="/register">
                  {getContent('hero', 'cta_primary_text', 'Get Started')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-sm h-11">
                <Link to="/how-it-works">{getContent('hero', 'cta_secondary_text', 'Learn More')}</Link>
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
                src={getContent('hero', 'image_url', 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')}
                alt="IdeaVest Platform"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass p-6 rounded-lg max-w-lg text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Secure Idea Marketplace</h2>
                  <p className="text-gray-700 dark:text-gray-200">Our platform ensures complete protection for both idea creators and investors through secure agreements and proper validation.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/30 mb-6">
              Platform Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {getContent('features', 'headline', 'A Complete Ecosystem for Ideas')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {getContent('features', 'subheadline', 'Our platform caters to all stakeholders in the innovation process, from idea conception to investment.')}
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
                key={feature.id}
                className="flex flex-col h-full bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    {getIconByName(feature.icon_name)}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/30 mb-6">
              Simple Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {getContent('howItWorks', 'headline', 'How IdeaVest Works')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {getContent('howItWorks', 'subheadline', 'Our streamlined process ensures that great ideas get recognized, valued, and funded.')}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-border"></div>
            
            <div className="space-y-12 relative">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <motion.div 
                      className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                          <span className="text-xs font-semibold tracking-wide text-primary uppercase mr-2">Step</span>
                          <span className="text-xl font-bold text-primary">{step.step_number}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-6 left-1/2 -ml-3">
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-primary border-4 border-background"
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
            <h2 className="text-3xl font-bold text-primary-foreground mb-6">
              {getContent('cta', 'headline', 'Ready to Bring Your Ideas to Life?')}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              {getContent('cta', 'subheadline', 'Join our platform today and become part of an ecosystem that values innovation and creates opportunities for both idea creators and investors.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-primary">
                <Link to="/register">{getContent('cta', 'button_primary_text', 'Sign Up Now')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/how-it-works">{getContent('cta', 'button_secondary_text', 'Learn More')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
