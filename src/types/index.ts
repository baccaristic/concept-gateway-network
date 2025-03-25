
export interface Idea {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt?: string;
  owner_id?: string;
  submittedBy?: string;
  submitterName?: string;
  estimatedBudget?: number;
  estimatedPrice?: number;
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
  file?: File;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface User extends Profile {
  avatar?: string;
}

export type UserRole = 'IDEA_HOLDER' | 'INVESTOR' | 'EXPERT' | 'ADMIN';

export type IdeaStatus = 'AWAITING_APPROVAL' | 'APPROVED' | 'ESTIMATED' | 'CONFIRMED'
