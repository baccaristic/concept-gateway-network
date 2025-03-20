export interface Idea {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  submittedBy?: string;
  submitterName?: string;
  estimatedBudget?: number;
  views?: number;
  likes?: number;
  tags?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  user: string;
  userName: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  file?: File; // Added file property for uploading
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}
