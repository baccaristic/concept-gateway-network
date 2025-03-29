
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: "How to Properly Value Your Innovative Idea",
      excerpt: "Understanding the true value of your idea is crucial before seeking investment. This guide covers the key factors to consider when determining your idea's market worth.",
      category: "Ideas",
      author: "Sarah Johnson",
      date: "June 15, 2023",
      image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Investor Insights: What We Look for in Ideas",
      excerpt: "Get a behind-the-scenes look at the evaluation criteria investors use when reviewing new ideas and deciding which ones to fund.",
      category: "Investors",
      author: "Michael Chang",
      date: "May 23, 2023",
      image: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Protecting Your Intellectual Property in the Digital Age",
      excerpt: "Learn about the various ways to secure your idea's intellectual property rights and why it matters for your long-term success.",
      category: "Legal",
      author: "Amanda Torres",
      date: "April 10, 2023",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "From Idea to Market: Success Stories on IdeaVest",
      excerpt: "Read inspiring stories of entrepreneurs who successfully took their ideas from concept to market reality with the help of our platform.",
      category: "Success Stories",
      author: "Daniel Lewis",
      date: "March 28, 2023",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "The Expert Evaluation Process Explained",
      excerpt: "A detailed look at how our expert panel evaluates submitted ideas and provides valuable feedback to idea holders.",
      category: "Platform",
      author: "Rebecca Wilson",
      date: "February 14, 2023",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "5 Common Pitfalls to Avoid When Presenting Your Idea",
      excerpt: "Avoid these common mistakes that can undermine your idea's potential and reduce your chances of securing investment.",
      category: "Ideas",
      author: "James Rodriguez",
      date: "January 30, 2023",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
  ];

  // Extract unique categories
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

  // Filter posts based on search query and active category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get featured post
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              IdeaVest Blog
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Insights, tips, and success stories from our community of innovators and investors.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                className="bg-white rounded-lg overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-full bg-gray-200 relative">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="absolute w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                    <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <div className="flex items-center mr-6">
                        <User className="h-4 w-4 mr-2" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{featuredPost.date}</span>
                      </div>
                    </div>
                    
                    <Button className="w-fit">
                      Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.filter(post => !post.featured).map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="absolute w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <Badge className="w-fit mb-2">{post.category}</Badge>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4 mt-auto">
                        <div className="flex items-center mr-4">
                          <User className="h-3 w-3 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" className="w-full text-primary">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4"
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest articles, insights, and platform updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Your email address" className="flex-grow" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
