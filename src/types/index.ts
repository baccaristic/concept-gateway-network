
export interface Idea {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  owner_id?: string;
  submittedBy?: string;
  submitterName?: string;
  estimatedBudget?: number;
  estimatedPrice?: number;  // Added this property
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

// Adding User type which extends Profile with any user-specific properties
export interface User extends Profile {
  // Any additional user properties can go here
}

// Adding UserRole type
export type UserRole = 'idea-holder' | 'investor' | 'expert' | 'admin';
