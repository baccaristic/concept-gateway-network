
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Shield, Globe, Lightbulb, Users } from 'lucide-react';

const About = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    {
      name: "Sarah Johnson",
      title: "Founder & CEO",
      bio: "Sarah has over 15 years of experience in venture capital and startup acceleration. She founded IdeaVest to bridge the gap between innovative ideas and funding opportunities.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Michael Chen",
      title: "Chief Technology Officer",
      bio: "With a background in software engineering and cybersecurity, Michael leads our technical team in building a secure and efficient platform for idea holders and investors.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Olivia Rodriguez",
      title: "Head of Investor Relations",
      bio: "Olivia brings valuable expertise from her previous role as an investment banker. She helps cultivate relationships with our growing network of investors.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "David Kim",
      title: "Lead Expert Evaluator",
      bio: "David coordinates our panel of industry experts who evaluate submitted ideas. His background in product development gives him unique insight into idea valuation.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We believe in the power of ideas to change the world and are committed to fostering innovation in all its forms.",
      icon: <Lightbulb className="h-10 w-10 text-primary" />
    },
    {
      title: "Integrity",
      description: "We maintain the highest standards of honesty and ethics in all our interactions with idea holders and investors.",
      icon: <Shield className="h-10 w-10 text-primary" />
    },
    {
      title: "Excellence",
      description: "We strive for excellence in our platform, processes, and the support we provide to our community members.",
      icon: <Award className="h-10 w-10 text-primary" />
    },
    {
      title: "Inclusion",
      description: "We welcome innovators from all backgrounds and are committed to creating equal opportunities for all idea holders.",
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      title: "Global Perspective",
      description: "We recognize that great ideas come from everywhere and aim to connect innovators and investors across the globe.",
      icon: <Globe className="h-10 w-10 text-primary" />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              About IdeaVest
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We're on a mission to bridge the gap between groundbreaking ideas and the resources needed to bring them to life.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  IdeaVest was founded in 2020 with a simple but powerful vision: to create a platform where innovative ideas could meet investment opportunities in a secure, transparent environment.
                </p>
                <p className="text-gray-600 mb-4">
                  Our founder, Sarah Johnson, experienced firsthand the challenges of bringing a great idea to market without the right connections or resources. She envisioned a platform that would level the playing field for innovators worldwide.
                </p>
                <p className="text-gray-600 mb-4">
                  Today, IdeaVest has grown into a thriving ecosystem connecting thousands of idea holders with investors across the globe. We've facilitated funding for hundreds of projects that might otherwise never have seen the light of day.
                </p>
                <p className="text-gray-600">
                  Our commitment to protecting intellectual property while fostering meaningful connections has established IdeaVest as the premier platform for idea-to-market journeys.
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
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="IdeaVest team at work" 
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

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600">
              The core principles that guide everything we do at IdeaVest.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-lg text-gray-600">
              Meet the dedicated individuals working to connect ideas with opportunities.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-64 relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.title}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-lg text-white/80 mb-8">
              Whether you're an idea holder, an investor, or an expert in your field, we invite you to become part of the IdeaVest community and help shape the innovations of tomorrow.
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

export default About;
