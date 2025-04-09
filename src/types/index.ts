
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
  additional_data?: IdeaAdditionalData;
}

export interface IdeaAdditionalData {
  sector?: string;
  technology?: string;
  region?: string;
  website?: string;
  innovation?: InnovationData;
  market?: MarketData;
  progress?: ProgressData;
  team?: TeamData;
  presentation?: PresentationData;
  funding?: FundingData;
  additional?: AdditionalInfo;
  documents?: DocumentData[];
}

export interface InnovationData {
  project_description?: string;
  problem_statement?: string;
  solution?: string;
  innovation_factors?: string;
  competitors?: string;
  differentiating_factors?: string;
  business_model?: string;
  growth_potential?: string;
  product_video_url?: string;
  product_website?: string;
  has_other_products?: boolean;
}

export interface MarketData {
  target_market?: string;
  current_markets?: MarketEntry[];
  future_markets?: MarketEntry[];
  market_size?: string;
  target_market_share?: string;
  growth_strategy?: string;
  current_users?: string;
  projected_users?: string;
}

export interface MarketEntry {
  target: string;
  country: string;
  year: string;
  marketType: string;
}

export interface ProgressData {
  project_stage?: string;
  current_progress?: string;
  joined_incubator?: boolean;
  won_entrepreneurship_award?: boolean;
  filed_patents?: boolean;
}

export interface TeamData {
  number_of_cofounders?: string;
  team_description?: string;
  team_capable?: boolean;
  time_working_on_project?: string;
  worked_together_before?: boolean;
  launched_startup_before?: boolean;
}

export interface PresentationData {
  pitch_video_url?: string;
  pitch_deck_url?: string;
}

export interface FundingData {
  fundraising_goal?: string;
  revenue_projection?: string;
}

export interface AdditionalInfo {
  why_apply?: string;
  want_other_benefits?: boolean;
  certify_information?: boolean;
  accept_conditions?: boolean;
  authorize_sharing?: boolean;
}

export interface DocumentData {
  name: string;
  file: File;
  type: string;
  size: number;
  description?: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type UserRole = 'IDEA_HOLDER' | 'INVESTOR' | 'EXPERT' | 'ADMIN';

export type IdeaStatus = 'AWAITING_APPROVAL' | 'APPROVED' | 'ESTIMATED' | 'CONFIRMED';

export type AgreementStatus = 'PENDING' | 'SIGNED' | 'APPROVED' | 'REJECTED';

export interface Agreement {
  id: string;
  ideaId: string;
  investorId: string;
  status: AgreementStatus;
  signatureData?: string;
  signedAt?: string;
  createdAt: string;
  idea?: Idea;
}
