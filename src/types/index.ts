
export type UserRole = 'idea-holder' | 'expert' | 'admin' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Comment {
  id: string;
  text: string;
  user: string;
  userName: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  ownerId?: string;
  owner?: User;
  submittedBy?: string;
  submitterName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'estimated';
  estimatedPrice?: number;
  estimatedBudget?: number;
  attachments?: Attachment[];
  category?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: Comment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Agreement {
  id: string;
  investorId: string;
  ideaId: string;
  signedAt?: string;
  status: 'pending' | 'signed';
  signature?: string;
}
