import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAllIdeas, fetchCategories, fetchTags } from '@/services/api';
import { Idea, Category, Tag } from '@/types';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, Circle, Search, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/contexts/AuthContext';

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<keyof Idea | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Data fetching
  const { data: ideas, isLoading: isIdeasLoading, isError: isIdeasError } = useQuery<Idea[]>('ideas', fetchAllIdeas);
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery<Category[]>('categories', fetchCategories);
  const { data: tags, isLoading: isTagsLoading, isError: isTagsError } = useQuery<Tag[]>('tags', fetchTags);

  useEffect(() => {
    if (isIdeasError || isCategoriesError || isTagsError) {
      toast({
        title: "Error!",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    }
  }, [isIdeasError, isCategoriesError, isTagsError, toast]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const handleSort = (column: keyof Idea) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setDateRange(undefined);
  };

  // Filtering and sorting
  const filteredIdeas = React.useMemo(() => {
    if (!ideas) return [];

    let result = [...ideas];

    // Search filter
    if (searchQuery) {
      result = result.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(idea =>
        idea.categories.some(category => selectedCategories.includes(category.id))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter(idea =>
        idea.tags.some(tag => selectedTags.includes(tag.id))
      );
    }

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      result = result.filter(idea => {
        const createdAt = new Date(idea.createdAt);
        const fromDate = dateRange.from;
        const toDate = dateRange.to;
        return createdAt >= fromDate && createdAt <= toDate;
      });
    }

    return result;
  }, [ideas, searchQuery, selectedCategories, selectedTags, dateRange]);

  const processedIdeas = filteredIdeas.map(idea => ({
    ...idea,
    canView: true // Add the missing canView property
  }));

  const sortedIdeas = React.useMemo(() => {
    if (!processedIdeas || !sortColumn) return processedIdeas;

    return [...processedIdeas].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [processedIdeas, sortColumn, sortDirection]);

  if (isIdeasLoading || isCategoriesLoading || isTagsLoading) {
    return <Layout user={user}><div>Loading...</div></Layout>;
  }

  return (
    <Layout user={user}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-5">Investor Dashboard</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-3">
          <div className="w-full md:w-1/2 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow"
            />
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-2" />
          </div>

          <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="mb-5 p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-3">Filter Options</h2>

            {/* Categories Filter */}
            <div className="mb-3">
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories?.map(category => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mb-3">
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags?.map(tag => (
                  <label key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-3">
              <h3 className="text-lg font-medium mb-2">Date Range</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !dateRange?.from ? "text-muted-foreground" : undefined
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateChange}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters Button */}
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Ideas Table */}
        <ScrollArea>
          <Table>
            <TableCaption>A list of your recent investments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort('title')}>
                    Title
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('description')}>
                    Description
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                    Created At
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('categories')}>
                    Categories
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('tags')}>
                    Tags
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedIdeas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell className="font-medium">{idea.title}</TableCell>
                  <TableCell>{idea.description}</TableCell>
                  <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {idea.categories.map((category) => (
                      <div key={category.id}>{category.name}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {idea.tags.map((tag) => (
                      <div key={tag.id}>{tag.name}</div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" onClick={() => navigate(`/ideas/${idea.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sortedIdeas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No ideas found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default InvestorDashboard;
