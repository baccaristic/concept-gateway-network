
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Copyright = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "August 15, 2023";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Copyright Policy
            </h1>
            <p className="text-gray-600">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Copyright Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="prose prose-lg max-w-none">
                <p>
                  IdeaVest respects the intellectual property rights of others and expects our users to do the same. This Copyright Policy outlines our procedures for addressing claims of copyright infringement and for responding to notices of alleged infringement.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Copyright Protection for Ideas</h2>
                <p>
                  At IdeaVest, we understand the importance of protecting your innovative ideas. When you submit an idea to our platform, you retain ownership of your intellectual property rights. Our platform is designed to protect your ideas through several mechanisms:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Confidentiality agreements required for all users accessing idea details</li>
                  <li>Secure data storage and transmission protocols</li>
                  <li>Limited access controls based on user roles and permissions</li>
                  <li>Digital watermarking of documents when appropriate</li>
                  <li>Audit trails of who has accessed your idea information</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Digital Copyright Agreements</h2>
                <p>
                  Our platform facilitates digital copyright agreements between idea creators and investors. These agreements:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Are legally binding documents that protect the rights of idea creators</li>
                  <li>Specify the terms and conditions under which investors can access and use idea information</li>
                  <li>May include non-disclosure provisions, non-compete clauses, and licensing terms</li>
                  <li>Create a verifiable record of the agreement between parties</li>
                </ul>
                <p>
                  All users are required to abide by the terms of these agreements. Violations may result in account termination and potential legal consequences.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Copyright Infringement Claims</h2>
                <p>
                  If you believe that your copyrighted work has been copied and is accessible on our platform in a way that constitutes copyright infringement, you may notify our Copyright Agent by providing the following information:
                </p>
                <ol className="list-decimal pl-6 mb-6">
                  <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright that has allegedly been infringed.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit IdeaVest to locate the material.</li>
                  <li>Information reasonably sufficient to permit IdeaVest to contact the complaining party, such as an address, telephone number, and, if available, an email address.</li>
                  <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of the copyright that is allegedly infringed.</li>
                </ol>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Counter-Notification Procedures</h2>
                <p>
                  If material you posted on IdeaVest has been taken down due to a copyright infringement claim, you may file a counter-notification by providing our Copyright Agent with the following information:
                </p>
                <ol className="list-decimal pl-6 mb-6">
                  <li>Your physical or electronic signature.</li>
                  <li>Identification of the material that has been removed and the location at which the material appeared before it was removed.</li>
                  <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material.</li>
                  <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court in the district where you live (or in San Francisco, California if you live outside the United States), and that you will accept service of process from the person who provided the original notification of alleged infringement.</li>
                </ol>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Repeat Infringer Policy</h2>
                <p>
                  In accordance with applicable laws, IdeaVest maintains a policy to terminate, in appropriate circumstances, the accounts of users who repeatedly infringe copyrights or other intellectual property rights of others.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. User Obligations</h2>
                <p>
                  All users of IdeaVest are expected to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Respect the intellectual property rights of others</li>
                  <li>Only submit content for which they hold the necessary rights or permissions</li>
                  <li>Honor confidentiality agreements and copyright notices</li>
                  <li>Report any suspected copyright infringements they encounter on our platform</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Changes to This Policy</h2>
                <p>
                  We may update this Copyright Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Contact Information</h2>
                <p>
                  For copyright matters, please contact our Copyright Agent at:
                </p>
                <p>
                  IdeaVest Copyright Agent<br />
                  123 Innovation Drive<br />
                  San Francisco, CA 94103<br />
                  copyright@ideavest.com<br />
                  (555) 123-4567
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-6">
                  By using IdeaVest, you acknowledge that you have read, understood, and agree to our Copyright Policy.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link to="/terms">View Terms of Service</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/privacy">View Privacy Policy</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Copyright;
