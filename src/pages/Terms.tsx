import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ColorSection, ColorHeading, ColorText, ColorHero } from '@/components/ui/color-section';

const Terms = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "August 15, 2023";

  return (
    <Layout>
      {/* Hero Section */}
      <ColorHero>
        <ColorHeading level={1} className="mb-6">
          Terms of Service
        </ColorHeading>
        <ColorText>
          Last Updated: {lastUpdated}
        </ColorText>
      </ColorHero>

      {/* Terms Content */}
      <ColorSection>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="prose prose-lg max-w-none">
              <p>
                Welcome to IdeaVest. These Terms of Service ("Terms") govern your use of the IdeaVest website, platform, and services (collectively, the "Services"). Please read these Terms carefully before using our Services.
              </p>
              
              <p>
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to all of these Terms, you may not use our Services.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Account Registration</h2>
              <p>
                To access certain features of our Services, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself as prompted by the registration form and to keep this information updated.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Idea Submission</h2>
              <p>
                When you submit an idea to our platform, you retain ownership of your intellectual property rights. However, you grant IdeaVest a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display the content solely for the purpose of providing and promoting the Services.
              </p>
              <p>
                You represent and warrant that you have all necessary rights, permissions, and consents to submit your idea and that your submission does not infringe or violate the rights of any third party.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Investor Obligations</h2>
              <p>
                As an investor using our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Comply with all applicable laws and regulations related to investing and financial transactions.</li>
                <li>Honor the confidentiality of ideas and respect the intellectual property rights of idea submitters.</li>
                <li>Provide accurate information about your investor profile and qualifications.</li>
                <li>Adhere to the terms of any agreements you enter into with idea submitters through our platform.</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Expert Evaluations</h2>
              <p>
                Expert evaluations are provided for informational purposes only and do not constitute investment advice. IdeaVest does not guarantee the accuracy, completeness, or usefulness of any evaluation.
              </p>
              <p>
                Experts are independent contractors, not employees of IdeaVest, and their opinions are their own. IdeaVest is not responsible for the content of expert evaluations.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Prohibited Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Use our Services for any illegal purpose or in violation of any laws.</li>
                <li>Submit false, misleading, or fraudulent information.</li>
                <li>Attempt to circumvent any security features of our Services.</li>
                <li>Interfere with the proper working of the Services or place an unreasonable load on our infrastructure.</li>
                <li>Use automated means to access or collect data from our Services without our prior written consent.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity.</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Fees and Payments</h2>
              <p>
                IdeaVest charges fees for certain services as described on our website. All fees are exclusive of taxes unless otherwise stated. You are responsible for paying all applicable taxes.
              </p>
              <p>
                Payments are processed through third-party payment processors. By using our fee-based services, you agree to the terms and conditions of these payment processors.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Termination</h2>
              <p>
                IdeaVest may terminate or suspend your access to all or part of our Services, with or without notice, for any conduct that we, in our sole discretion, believe violates these Terms, is harmful to other users, or is harmful to our business interests.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p>
                The Services are provided on an "as is" and "as available" basis. IdeaVest makes no warranties, either express or implied, about the Services. IdeaVest specifically disclaims all warranties and conditions of any kind, including but not limited to, warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. Limitation of Liability</h2>
              <p>
                IdeaVest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, resulting from your use of the Services or any content provided through the Services.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless IdeaVest, its officers, directors, employees, agents, and representatives from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal fees, arising out of or in any way connected with your access to or use of the Services or your violation of these Terms.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">11. Changes to Terms</h2>
              <p>
                IdeaVest may revise these Terms at any time by posting an updated version on our website. Your continued use of the Services after any changes to the Terms constitutes your acceptance of the revised Terms.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any dispute arising from these Terms shall be resolved exclusively in the state or federal courts located in San Francisco County, California.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                IdeaVest, Inc.<br />
                123 Innovation Drive<br />
                San Francisco, CA 94103<br />
                legal@ideavest.com
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground mb-6">
                By using IdeaVest, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link to="/register">
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/privacy">View Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </ColorSection>
    </Layout>
  );
};

export default Terms;
