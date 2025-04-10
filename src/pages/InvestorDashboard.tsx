
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, ExternalLink, FileText, FileDigit, TrendingUp, ListFilter } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { ideasApi, investorApi } from "@/services/api";
import { Agreement, Idea } from "@/types";
import { useToast } from "@/hooks/use-toast";
import AgreementDialog from "@/components/AgreementDialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { openAgreementPdf } from "@/utils/pdfGenerator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Available categories for filtering
const categories = [
  "All",
  "Energy",
  "Healthcare",
  "Agriculture",
  "Technology",
  "Environment",
  "Finance",
  "Education",
];

// Extended Idea type with canView property
interface IdeaWithView extends Idea {
  canView: boolean;
}

const InvestorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ideas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("estimatedValue");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [ideas, setIdeas] = useState<IdeaWithView[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<IdeaWithView | null>(null);
  const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { user } = useAuth();

  useEffect(() => {
    // Fetch ideas and agreements when the component mounts
    fetchIdeas();
    fetchAgreements();
  }, []);

  const fetchIdeas = async () => {
    try {
      const data = await ideasApi.getInvestorEstimatedIdeas();
      // Add canView property to each idea
      const ideasWithView = data.map(idea => ({
        ...idea,
        canView: false // Set default, will be updated based on agreements
      }));
      setIdeas(ideasWithView);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchAgreements = async () => {
    try {
      const data = await investorApi.getMyAgreements();
      setAgreements(data);
      
      // Update canView property for ideas with agreements
      setIdeas(prevIdeas => prevIdeas.map(idea => ({
        ...idea,
        canView: data.some(agreement => 
          agreement.ideaId === idea.id && 
          (agreement.status === 'SIGNED' || agreement.status === 'APPROVED')
        )
      })));
    } catch (error) {
      console.error("Error fetching agreements:", error);
      toast({
        title: "Error",
        description: "Failed to load agreements. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Filter and sort ideas based on search term, category, and sorting preferences
  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || idea.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sorting logic
      if (sortBy === "estimatedValue") {
        return sortOrder === "asc"
          ? a.estimatedPrice - b.estimatedPrice
          : b.estimatedPrice - a.estimatedPrice;
      } else if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle idea selection for viewing details
  const handleIdeaSelect = (idea: IdeaWithView) => {
    if (idea.canView) {
      navigate(`/ideas/${idea.id}`);
    }
    else {
      handleCreateAgreement(idea);
    }
  };

  const handleIdeaSelectFromAgreement = (ideaId: string) => {
    navigate(`/ideas/${ideaId}`);
  }

  const handleCreateAgreement = (idea: IdeaWithView) => {
    setSelectedIdea(idea);
    setAgreementDialogOpen(true);
  };

  // Handle agreement signing
  const handleSignAgreement = async (signatureData: string) => {
    if (!selectedIdea) return;

    setIsLoading(true);
    try {
      // First create an agreement
      const agreement = await investorApi.createAgreement(selectedIdea.id);

      // Then submit the signed agreement
      await investorApi.submitSignedAgreement(agreement.id, signatureData);

      toast({
        title: "Success",
        description: "Agreement signed successfully",
      });

      // Refresh agreements list
      fetchAgreements();
      fetchIdeas();
      setAgreementDialogOpen(false);
    } catch (error) {
      console.error("Error signing agreement:", error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening the PDF viewer
  const handleViewPdf = (agreement: Agreement) => {
    openAgreementPdf(agreement);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'SIGNED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Signed</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Energy':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">{category}</Badge>;
      case 'Healthcare':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">{category}</Badge>;
      case 'Agriculture':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{category}</Badge>;
      case 'Technology':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{category}</Badge>;
      case 'Environment':
        return <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">{category}</Badge>;
      case 'Finance':
        return <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">{category}</Badge>;
      case 'Education':
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Investor Dashboard</h1>
          <p className="text-muted-foreground mb-8">Discover and invest in groundbreaking ideas</p>
        </motion.div>

        <Tabs defaultValue="ideas" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="ideas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Available Ideas
            </TabsTrigger>
            <TabsTrigger value="agreements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Agreements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8 border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                  <CardTitle>Find Promising Ideas</CardTitle>
                  <CardDescription>
                    Search and filter through estimated ideas to find your next investment opportunity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter Section */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="w-full md:w-64">
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value)}
                      >
                        <SelectTrigger className="w-full">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={toggleSortOrder}
                        className="w-full md:w-auto"
                      >
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        {sortOrder === "asc" ? "Price ↑" : "Price ↓"}
                      </Button>
                      
                      <div className="flex rounded-md overflow-hidden border border-input">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setViewMode("grid")}
                          className={cn(
                            "rounded-none",
                            viewMode === "grid" && "bg-muted"
                          )}
                        >
                          <ListFilter className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setViewMode("table")}
                          className={cn(
                            "rounded-none",
                            viewMode === "table" && "bg-muted"
                          )}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ideas Display Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-3">
                  <CardTitle>
                    Available Ideas {filteredIdeas.length > 0 && `(${filteredIdeas.length})`}
                  </CardTitle>
                  <CardDescription>
                    Click on an idea to view details or create an investment agreement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredIdeas.length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIdeas.map((idea, index) => (
                          <motion.div
                            key={idea.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          >
                            <Card 
                              className={cn(
                                "h-full overflow-hidden transition-all duration-300 hover:shadow-lg", 
                                idea.canView ? "cursor-pointer hover:scale-[1.01]" : "cursor-pointer hover:scale-[1.01] relative"
                              )}
                              onClick={() => handleIdeaSelect(idea)}
                            >
                              {!idea.canView && (
                                <div className="absolute top-2 right-2 z-10">
                                  <Badge variant="secondary" className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    Sign Agreement to View
                                  </Badge>
                                </div>
                              )}
                              <div className={cn(!idea.canView && "opacity-90")}>
                                <div className="h-36 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center p-4">
                                  <div className="text-4xl text-primary/50 font-bold flex items-center">
                                    <FileText className="h-12 w-12 mr-2 text-primary/70" />
                                    <span>{idea.category}</span>
                                  </div>
                                </div>
                                <CardContent className="p-6">
                                  <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-3">
                                      {getCategoryBadge(idea.category || "")}
                                      <span className="flex items-center font-semibold text-green-600 dark:text-green-400">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        ${idea.estimatedPrice?.toLocaleString()}
                                      </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{idea.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{idea.description}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                      <span className="text-xs text-muted-foreground">
                                        Added {new Date(idea.createdAt).toLocaleDateString()}
                                      </span>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="ml-auto"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleIdeaSelect(idea);
                                        }}
                                      >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        {idea.canView ? "View Details" : "Sign Agreement"}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Estimated Value</TableHead>
                              <TableHead>Date Added</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredIdeas.map((idea) => (
                              <TableRow key={idea.id} className="transition-colors hover:bg-muted/30">
                                <TableCell className="font-medium">{idea.title}</TableCell>
                                <TableCell>{getCategoryBadge(idea.category || "")}</TableCell>
                                <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                  ${idea.estimatedPrice?.toLocaleString()}
                                </TableCell>
                                <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleIdeaSelect(idea)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      {idea.canView ? "View Details" : "Sign Agreement"}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">No ideas match your search criteria</h3>
                      <p className="text-sm mb-4">Try adjusting your filters or search term</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("All");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="agreements">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-none shadow-md bg-card">
                <CardHeader>
                  <CardTitle>My Investment Agreements</CardTitle>
                  <CardDescription>
                    Track the status of your investment agreements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {agreements.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Idea</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Investment Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agreements.map((agreement, index) => (
                            <motion.tr
                              key={agreement.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
                            >
                              <TableCell className="font-medium">
                                {agreement.idea?.title || "Unknown Idea"}
                              </TableCell>
                              <TableCell>
                                {new Date(agreement.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                ${agreement.idea?.estimatedPrice?.toLocaleString() || "N/A"}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(agreement.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleIdeaSelectFromAgreement(agreement.ideaId)}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View Idea
                                  </Button>

                                  {agreement.status === 'SIGNED' || agreement.status === 'APPROVED' ? (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleViewPdf(agreement)}
                                    >
                                      <FileDigit className="h-4 w-4 mr-1" />
                                      View PDF
                                    </Button>
                                  ) : null}
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileDigit className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">No agreements yet</h3>
                      <p className="text-sm mb-4">You don't have any investment agreements yet. Start investing in ideas to see them here.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("ideas")}
                      >
                        Browse Ideas
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
        <AgreementDialog
          open={agreementDialogOpen}
          onOpenChange={setAgreementDialogOpen}
          idea={selectedIdea}
          onSignAgreement={handleSignAgreement}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default InvestorDashboard;
