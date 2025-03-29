
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  
  const faqCategories = [
    {
      title: "For Idea Holders",
      faqs: [
        {
          question: "How do I submit my idea on IdeaVest?",
          answer: "To submit your idea, first create an account and log in. Then, navigate to the 'Submit Idea' page from your dashboard. Fill in the required details about your idea, upload any supporting documents or images, and submit it for review."
        },
        {
          question: "How is my idea protected on IdeaVest?",
          answer: "Your idea is protected through our comprehensive security measures. All investors must sign a legally binding non-disclosure agreement before accessing your full idea details. Additionally, our platform uses encryption and restricted access controls to ensure only authorized users can view your submission."
        },
        {
          question: "How long does the evaluation process take?",
          answer: "The evaluation process typically takes 1-2 weeks. During this period, our expert panel reviews your idea for its uniqueness, marketability, and potential value. You'll receive notifications about the progress and final evaluation results."
        },
        {
          question: "Can I update my idea after submission?",
          answer: "Yes, you can update your idea before it receives expert evaluation. After evaluation, minor updates are still possible, but significant changes may require a re-evaluation. You can manage all updates through your dashboard."
        }
      ]
    },
    {
      title: "For Investors",
      faqs: [
        {
          question: "How do I find ideas to invest in?",
          answer: "As an investor, you'll have access to a dedicated dashboard where you can browse through approved ideas. You can filter ideas by category, evaluation rating, funding needs, and other criteria to find opportunities that match your investment interests."
        },
        {
          question: "What is the copyright agreement process?",
          answer: "Before viewing detailed information about an idea, you'll need to sign our digital copyright agreement. This legally binding document protects the idea holder's intellectual property while allowing you to evaluate the opportunity. The signing process is simple and handled entirely through our secure platform."
        },
        {
          question: "How do I contact an idea holder?",
          answer: "After signing the copyright agreement for a specific idea, you'll gain access to a secure messaging system that allows direct communication with the idea holder. All communications are encrypted and recorded within our platform for security and reference purposes."
        },
        {
          question: "What fees does IdeaVest charge for investors?",
          answer: "IdeaVest charges a small transaction fee only when an investment deal is successfully completed. There are no upfront fees or subscription costs for browsing ideas or communicating with idea holders."
        }
      ]
    },
    {
      title: "Platform & Technical",
      faqs: [
        {
          question: "Is my personal and financial information secure?",
          answer: "Yes, we use industry-standard encryption and security protocols to protect all user data. Our platform complies with global data protection regulations, and we never share your personal or financial information with third parties without your explicit consent."
        },
        {
          question: "Can I use IdeaVest on mobile devices?",
          answer: "Yes, IdeaVest is fully optimized for mobile use. You can access all platform features through our responsive website on any smartphone or tablet. We recommend using the latest version of Chrome, Safari, or Firefox for the best experience."
        },
        {
          question: "How do I report technical issues?",
          answer: "If you encounter any technical issues, please use the 'Help & Support' section in your account settings. Alternatively, you can contact our technical support team directly through our Contact page or by emailing support@ideavest.com."
        },
        {
          question: "Can I delete my account and all my data?",
          answer: "Yes, you can delete your account and associated data through the Account Settings page. Please note that while personal data will be removed, some transaction records may be retained for legal and financial compliance purposes."
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery 
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions about IdeaVest, our processes, and how you can make the most of our platform.
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  className="mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">{category.title}</h2>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`} className="border rounded-lg px-2">
                        <AccordionTrigger className="text-left font-medium py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear search
                </Button>
              </div>
            )}
            
            {/* Still have questions */}
            <div className="mt-16 p-8 bg-gray-50 rounded-xl text-center">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                If you couldn't find the answer to your question, please don't hesitate to contact our support team.
              </p>
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Faq;
