
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, Upload, X, FileText, PlusCircle } from 'lucide-react';

import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Attachment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description cannot exceed 2000 characters'),
  category: z.string().min(1, 'Please select a category'),
  estimatedBudget: z.string().optional().transform(val => val ? Number(val) : undefined),
  tags: z.array(z.string()).optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Entertainment',
  'Food & Beverage', 'Transportation', 'Sustainability', 'Social Impact', 'Other'
];

const SubmitIdea = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewIdea, setPreviewIdea] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      estimatedBudget: '',
      tags: [],
      acceptTerms: false
    },
  });

  const handleTagAdd = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      form.setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFiles = 3;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    if (attachments.length + files.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} files`);
      return;
    }

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} has an invalid file type`);
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds the 5MB size limit`);
        continue;
      }

      // For now, we'll just create an object with file information
      // We'll upload it to Supabase when the form is submitted
      const attachment: Attachment = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        file: file, // Store the actual file object for later upload
      };

      newAttachments.push(attachment);
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handlePreview = () => {
    const values = form.getValues();
    setPreviewIdea(values);
    setPreviewDialogOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit an idea');
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert idea into database
      const { data: ideaData, error: ideaError } = await supabase
        .from('ideas')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          estimated_budget: data.estimatedBudget,
          owner_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (ideaError) throw ideaError;

      const ideaId = ideaData.id;

      // Handle tags
      if (tags.length > 0) {
        // First ensure all tags exist in the tags table
        for (const tagName of tags) {
          const { error: tagError } = await supabase
            .from('tags')
            .upsert({ name: tagName }, { onConflict: 'name' })
            .select();

          if (tagError) throw tagError;
        }

        // Get the tag IDs
        const { data: tagData, error: tagSelectError } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', tags);

        if (tagSelectError) throw tagSelectError;

        // Create the idea-tag associations
        if (tagData && tagData.length > 0) {
          const ideaTagInserts = tagData.map(tag => ({
            idea_id: ideaId,
            tag_id: tag.id
          }));

          const { error: ideaTagError } = await supabase
            .from('idea_tags')
            .insert(ideaTagInserts);

          if (ideaTagError) throw ideaTagError;
        }
      }

      // Upload attachments to Supabase Storage
      if (attachments.length > 0) {
        for (const attachment of attachments) {
          if (!attachment.file) continue;

          // Upload file to storage
          const filePath = `${ideaId}/${attachment.id}-${attachment.name}`;
          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, attachment.file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);

          // Store attachment metadata in database
          const { error: attachmentError } = await supabase
            .from('attachments')
            .insert({
              idea_id: ideaId,
              name: attachment.name,
              url: publicUrl,
              type: attachment.type,
              size: attachment.size
            });

          if (attachmentError) throw attachmentError;
        }
      }

      toast.success('Idea submitted successfully!');
      
      // Navigate to dashboard after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error: any) {
      console.error('Error submitting idea:', error);
      toast.error(`Failed to submit idea: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type === 'application/pdf') {
      return 'pdf';
    } else {
      return 'document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Submit New Idea</h1>
              <p className="text-gray-500 mt-1">Share your innovative idea with our community</p>
            </div>
            <Sparkles className="h-10 w-10 text-primary opacity-70" />
          </div>

          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idea Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a catchy title for your idea" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your idea in detail" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedBudget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Budget (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter estimated budget in USD" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Tags (Optional)</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleTagAdd();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleTagAdd}
                          disabled={tags.length >= 5}
                        >
                          Add
                        </Button>
                      </div>
                      {tags.length >= 5 && (
                        <p className="text-xs text-amber-500">Maximum of 5 tags allowed</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-3 py-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <FormLabel>Attachments (Optional)</FormLabel>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Images or PDF (MAX. 5MB)
                            </p>
                          </div>
                          <input 
                            id="dropzone-file" 
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={handleFileUpload}
                            accept=".jpg,.jpeg,.png,.gif,.pdf"
                          />
                        </label>
                      </div>
                      
                      {attachments.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className="text-sm font-medium">Uploaded files ({attachments.length}/3):</p>
                          <div className="space-y-2">
                            {attachments.map((attachment) => (
                              <div 
                                key={attachment.id} 
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-[200px]">
                                      {attachment.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(attachment.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeAttachment(attachment.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the terms and conditions and agree to the idea submission policy
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePreview} 
                      disabled={!form.formState.isValid || isSubmitting}
                    >
                      Preview
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!form.formState.isValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Submit Idea
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Idea Preview</DialogTitle>
            <DialogDescription>
              This is how your idea will appear to experts and administrators
            </DialogDescription>
          </DialogHeader>
          
          {previewIdea && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{previewIdea.title}</h2>
                <Badge>{previewIdea.category}</Badge>
                {previewIdea.estimatedBudget && (
                  <div className="font-medium text-green-700">
                    Estimated Budget: ${previewIdea.estimatedBudget}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="whitespace-pre-wrap">{previewIdea.description}</p>
              </div>
              
              {tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Attachments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attachments.map((attachment) => (
                      <div 
                        key={attachment.id} 
                        className="flex items-center p-3 border rounded-md"
                      >
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SubmitIdea;
