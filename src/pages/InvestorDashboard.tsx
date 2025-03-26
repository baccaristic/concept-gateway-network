import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {ideasApi} from "@/services/api.ts";
import {Idea} from "@/types";


// Sample data - would be replaced with actual API call

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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("estimatedValue");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const {user} = useAuth();
    useEffect(() => {
        ideasApi.getEstimatedIdeas().then(
            (data) => {
                setIdeas(data);
            }
        )
    }, []);

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
                    ? a.estimatedBudget - b.estimatedBudget
                    : b.estimatedBudget - a.estimatedBudget;
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

    // Handle idea selection (for future implementation)
    const handleIdeaSelect = (ideaId: string) => {
        console.log(`Selected idea: ${ideaId}`);
        // Future functionality: view detailed idea information, contact idea owner, etc.
    };

    return (
        <Layout user={user}>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Investor Dashboard</h1>

                <Card className="mb-8">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Find Promising Ideas</h2>
                        <p className="text-muted-foreground mb-6">
                            Search and filter through estimated ideas to find your next investment opportunity.
                        </p>

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
                                Sort by Value {sortOrder === "asc" ? "↑" : "↓"}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Ideas Display Section */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Available Ideas {filteredIdeas.length > 0 && `(${filteredIdeas.length})`}
                        </h2>

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
                                                <TableCell>${idea.estimatedPrice.toLocaleString()}</TableCell>
                                                <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleIdeaSelect(idea.id)}
                                                    >
                                                        View Details
                                                    </Button>
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
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default InvestorDashboard;