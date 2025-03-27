
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, ExternalLink, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { ideasApi, investorApi } from "@/services/api";
import { Agreement, Idea } from "@/types";
import { useToast } from "@/hooks/use-toast";
import AgreementDialog from "@/components/AgreementDialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const InvestorDashboard = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("ideas");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("estimatedValue");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [agreements, setAgreements] = useState<Agreement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Fetch ideas and agreements when the component mounts
        fetchIdeas();
        fetchAgreements();
    }, []);

    const fetchIdeas = async () => {
        try {
            const data = await ideasApi.getEstimatedIdeas();
            setIdeas(data);
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
    const handleIdeaSelect = (ideaId: string) => {
        navigate(`/ideas/${ideaId}`);
    };

    // Handle agreement creation
    const handleCreateAgreement = (idea: Idea) => {
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'SIGNED':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Signed</Badge>;
            case 'APPROVED':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
            case 'REJECTED':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Layout user={user}>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Investor Dashboard</h1>

                <Tabs defaultValue="ideas" className="mb-8" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full md:w-auto grid-cols-2">
                        <TabsTrigger value="ideas">Available Ideas</TabsTrigger>
                        <TabsTrigger value="agreements">My Agreements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ideas">
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Find Promising Ideas</CardTitle>
                                <CardDescription>
                                    Search and filter through estimated ideas to find your next investment opportunity.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Search and Filter Section */}
                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
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
                                                <Filter className="mr-2 h-4 w-4"/>
                                                <SelectValue placeholder="Filter by category"/>
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

                                    <Button
                                        variant="outline"
                                        onClick={toggleSortOrder}
                                        className="w-full md:w-auto"
                                    >
                                        <ArrowUpDown className="h-4 w-4 mr-2" />
                                        {sortOrder === "asc" ? "Price ↑" : "Price ↓"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ideas Display Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Available Ideas {filteredIdeas.length > 0 && `(${filteredIdeas.length})`}
                                </CardTitle>
                                <CardDescription>
                                    Click on an idea to view details or create an investment agreement
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {filteredIdeas.length > 0 ? (
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
                                                    <TableRow key={idea.id}>
                                                        <TableCell className="font-medium">{idea.title}</TableCell>
                                                        <TableCell>{idea.category}</TableCell>
                                                        <TableCell>${idea.estimatedPrice?.toLocaleString()}</TableCell>
                                                        <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleIdeaSelect(idea.id)}
                                                                >
                                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                                    Details
                                                                </Button>
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => handleCreateAgreement(idea)}
                                                                >
                                                                    <FileText className="h-4 w-4 mr-1" />
                                                                    Invest
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No ideas match your search criteria. Try adjusting your filters.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="agreements">
                        <Card>
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
                                                {agreements.map((agreement) => (
                                                    <TableRow key={agreement.id}>
                                                        <TableCell className="font-medium">
                                                            {agreement.idea?.title || "Unknown Idea"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(agreement.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            ${agreement.idea?.estimatedPrice?.toLocaleString() || "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(agreement.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleIdeaSelect(agreement.ideaId)}
                                                            >
                                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                                View Idea
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        You don't have any investment agreements yet. Start investing in ideas to see them here.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Agreement Dialog */}
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
