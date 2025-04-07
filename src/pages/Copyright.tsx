
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ColorSection, ColorHeading, ColorText, ColorHero } from '@/components/ui/color-section';

const Copyright = () => {
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
          Copyright Policy
        </ColorHeading>
        <ColorText>
          Last Updated: {lastUpdated}
        </ColorText>
      </ColorHero>

      {/* Copyright Content */}
      <ColorSection>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="prose prose-lg max-w-none">
              <p>
                At IdeaVest, we respect the intellectual property rights of others and expect our users to do the same. This Copyright Policy outlines our procedures for responding to notices of alleged copyright infringement.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Digital Millennium Copyright Act</h2>
              <p>
                IdeaVest complies with the provisions of the Digital Millennium Copyright Act (DMCA) applicable to internet service providers. If you believe that material available on or through our Services infringes your copyright, you may request removal of those materials by submitting a written notification to our Copyright Agent.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. DMCA Notice Requirements</h2>
              <p>
                In accordance with the DMCA, the written notice (the "DMCA Notice") must include substantially the following:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Your physical or electronic signature.</li>
                <li>Identification of the copyrighted work you believe to have been infringed or, if the claim involves multiple works, a representative list of such works.</li>
                <li>Identification of the material you believe to be infringing in a sufficiently precise manner to allow us to locate that material.</li>
                <li>Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</li>
                <li>A statement that you have a good faith belief that use of the copyrighted material is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement that the information in the written notice is accurate.</li>
                <li>A statement, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Copyright Agent</h2>
              <p>
                Our designated Copyright Agent to receive DMCA Notices is:
              </p>
              <p>
                Legal Department<br />
                IdeaVest, Inc.<br />
                123 Innovation Drive<br />
                San Francisco, CA 94103<br />
                Email: copyright@ideavest.com
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Counter-Notice</h2>
              <p>
                If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notice containing the following information to our Copyright Agent:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Your physical or electronic signature.</li>
                <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled.</li>
                <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content.</li>
                <li>Your name, address, telephone number, and email address.</li>
                <li>A statement that you consent to the jurisdiction of the federal court in San Francisco, California.</li>
                <li>A statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Repeat Infringers</h2>
              <p>
                It is our policy in appropriate circumstances to disable and/or terminate the accounts of users who are repeat infringers.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Changes to Our Copyright Policy</h2>
              <p>
                IdeaVest reserves the right to modify this Copyright Policy at any time. We will post any changes to this policy on this page, and if the changes are significant, we will provide a more prominent notice.
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground mb-6">
                If you have any questions about our Copyright Policy, please contact us at copyright@ideavest.com.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link to="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/terms">View Terms of Service</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </ColorSection>
    </Layout>
  );
};

export default Copyright;
