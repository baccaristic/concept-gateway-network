
export type UserRole = 'idea-holder' | 'expert' | 'admin' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User;
  status: 'pending' | 'approved' | 'rejected' | 'estimated';
  estimatedPrice?: number;
  attachments?: Attachment[];
  category?: string;
  tags?: string[];
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
