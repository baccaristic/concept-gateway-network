
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Privacy = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "August 15, 2023";

  const privacySections = [
    {
      title: "Information We Collect",
      content: (
        <>
          <p className="mb-4">
            We collect several types of information from and about users of our Services, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Personal Data:</strong> First name, last name, email address, telephone number, postal address, professional information, and any other information you provide when creating an account or using our Services.</li>
            <li><strong>Financial Information:</strong> Payment details, bank account information, and transaction history when you make or receive payments through our platform.</li>
            <li><strong>Profile Data:</strong> Your username, password, account preferences, feedback, and survey responses.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and Services, including your browsing actions and patterns.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.</li>
            <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and our third parties.</li>
          </ul>
        </>
      )
    },
    {
      title: "How We Collect Information",
      content: (
        <>
          <p className="mb-4">We collect information through:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Direct Interactions:</strong> Information you provide when you create an account, submit an idea, contact us, or otherwise interact with our Services.</li>
            <li><strong>Automated Technologies:</strong> We use cookies, server logs, and similar technologies to collect technical data when you navigate through our website.</li>
            <li><strong>Third Parties:</strong> We may receive information about you from various third parties, such as analytics providers, advertising networks, and search information providers.</li>
          </ul>
        </>
      )
    },
    {
      title: "How We Use Your Information",
      content: (
        <>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process transactions and send related information.</li>
            <li>Create and maintain your account.</li>
            <li>Facilitate connections between idea holders and investors.</li>
            <li>Send administrative messages, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Personalize your experience and deliver content relevant to your interests.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </>
      )
    },
    {
      title: "Information Sharing and Disclosure",
      content: (
        <>
          <p className="mb-4">We may share your personal information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Service Providers:</strong> Companies that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.</li>
            <li><strong>Investors and Idea Holders:</strong> When necessary to facilitate connections and agreements between parties using our platform.</li>
            <li><strong>Legal Requirements:</strong> When required by law or if we believe that such action is necessary to comply with legal obligations or protect our rights and safety or the rights and safety of others.</li>
            <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
          </ul>
          <p>We will not sell your personal information to third parties for their marketing purposes without your explicit consent.</p>
        </>
      )
    },
    {
      title: "Your Rights and Choices",
      content: (
        <>
          <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Access:</strong> You can request copies of your personal information.</li>
            <li><strong>Rectification:</strong> You can ask us to correct inaccurate or incomplete information.</li>
            <li><strong>Erasure:</strong> You can ask us to delete your personal information in certain circumstances.</li>
            <li><strong>Restriction:</strong> You can ask us to restrict the processing of your personal information.</li>
            <li><strong>Data Portability:</strong> You can ask us to transfer your information to another organization.</li>
            <li><strong>Objection:</strong> You can object to our processing of your personal information.</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
        </>
      )
    },
    {
      title: "Data Security",
      content: (
        <>
          <p className="mb-4">
            We have implemented appropriate technical and organizational measures to protect your personal information from unauthorized access, accidental loss, and destruction. While we take these steps to ensure the security of your personal information, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
          </p>
          <p>
            We will notify you of any breach of your personal information as required by applicable law.
          </p>
        </>
      )
    },
    {
      title: "International Data Transfers",
      content: (
        <>
          <p className="mb-4">
            We may transfer your personal information to countries outside your country of residence for processing and storage. We will ensure that appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy and applicable law.
          </p>
          <p>
            For users in the European Economic Area (EEA), we may transfer your personal information to countries that do not have equivalent data protection laws to those in the EEA. When we do so, we will ensure appropriate safeguards are in place, such as standard contractual clauses approved by the European Commission.
          </p>
        </>
      )
    },
    {
      title: "Children's Privacy",
      content: (
        <>
          <p className="mb-4">
            Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will take steps to delete the information as soon as possible.
          </p>
          <p>
            If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.
          </p>
        </>
      )
    },
    {
      title: "Changes to This Privacy Policy",
      content: (
        <>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p>
            We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our Services after any changes to this Privacy Policy constitutes your acceptance of the revised policy.
          </p>
        </>
      )
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="prose prose-lg max-w-none mb-8 text-foreground">
                <p>
                  At IdeaVest, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website, platform, and services (collectively, the "Services").
                </p>
                <p>
                  By accessing or using our Services, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {privacySections.map((section, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`section-${index}`}
                    className="border border-border rounded-lg px-2 bg-card"
                  >
                    <AccordionTrigger className="text-left text-lg font-medium py-4 text-card-foreground">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-lg max-w-none pb-4 text-card-foreground">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="prose prose-lg max-w-none mt-8 text-foreground">
                <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p>
                  IdeaVest, Inc.<br />
                  123 Innovation Drive<br />
                  San Francisco, CA 94103<br />
                  privacy@ideavest.com
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-muted-foreground mb-6">
                  By using IdeaVest, you acknowledge that you have read, understood, and agree to our Privacy Policy.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link to="/terms">View Terms of Service</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/copyright">View Copyright Policy</Link>
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

export default Privacy;
