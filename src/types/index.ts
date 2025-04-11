export interface Idea {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt?: string;
  ownerId?: string;
  submittedBy?: string;
  submitterName?: string;
  estimatedBudget?: number;
  estimatedPrice?: number;
  views?: number;
  likes?: number;
  tags?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
  additionalData?: IdeaAdditionalData;
  canView?: boolean;
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
  projectDescription?: string;
  problemStatement?: string;
  solution?: string;
  innovationFactors?: string;
  competitors?: string;
  differentiatingFactors?: string;
  businessModel?: string;
  growthPotential?: string;
  productVideoUrl?: string;
  productWebsite?: string;
  hasOtherProducts?: boolean;
}

export interface MarketData {
  targetMarket?: string;
  currentMarkets?: MarketEntry[];
  futureMarkets?: MarketEntry[];
  marketSize?: string;
  targetMarketShare?: string;
  growthStrategy?: string;
  currentUsers?: string;
  projectedUsers?: string;
}

export interface MarketEntry {
  target: string;
  country: string;
  year: string;
  marketType: string;
}

export interface ProgressData {
  projectStage?: string;
  currentProgress?: string;
  joinedIncubator?: boolean;
  wonEntrepreneurshipAward?: boolean;
  filedPatents?: boolean;
}

export interface TeamData {
  numberOfCofounders?: string;
  teamDescription?: string;
  teamCapable?: boolean;
  timeWorkingOnProject?: string;
  workedTogetherBefore?: boolean;
  launchedStartupBefore?: boolean;
}

export interface PresentationData {
  pitchVideoUrl?: string;
  pitchDeckUrl?: string;
}

export interface FundingData {
  fundraisingGoal?: string;
  revenueProjection?: string;
}

export interface AdditionalInfo {
  whyApply?: string;
  wantOtherBenefits?: boolean;
  certifyInformation?: boolean;
  acceptConditions?: boolean;
  authorizeSharing?: boolean;
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

export interface PaymentInitResponse {
  payUrl: string;
  paymentRef: string;
}

export interface PaymentWebhookPayload {
  paymentRef: string;
  status: PaymentStatus;
  amount: number;
  timestamp: string;
  transactionId?: string;
  customerInfo?: {
    email?: string;
    name?: string;
    phone?: string;
  };
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface PaymentInfo {
  paymentRef: string;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
  completedAt?: string;
  ideaId?: string;
}
