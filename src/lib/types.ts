export type FeedState = 'ok' | 'degraded';
export type SystemStatus = 'OPERATIONAL' | 'DEGRADED' | 'INCIDENT';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export interface ApiError {
  code: string;
  message: string;
  source?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
}

export interface NewsResponse {
  items: NewsItem[];
  degraded: boolean;
  errors: ApiError[];
  fetchedAt: string;
}

export interface KevEntry {
  cveId: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  dueDate: string;
  knownRansomwareCampaignUse: string;
  requiredAction: string;
  notes?: string;
}

export interface KevResponse {
  total: number;
  latest: KevEntry[];
  catalogVersion?: string;
  dateReleased?: string;
  degraded: boolean;
  fetchedAt: string;
  error?: ApiError;
}

export interface CveItem {
  id: string;
  severity: Severity;
  cvssScore: number | null;
  vector: string;
  vendor: string;
  product: string;
  summary: string;
  publishedAt: string;
}

export interface CvesResponse {
  items: CveItem[];
  degraded: boolean;
  errors: ApiError[];
  fetchedAt: string;
}

export interface RansomwareVictim {
  victim: string;
  group: string;
  country: string;
  sector: string;
  date: string;
  claimUrl: string;
}

export interface RansomwareResponse {
  victims: RansomwareVictim[];
  byCountry: Record<string, number>;
  degraded: boolean;
  fetchedAt: string;
  error?: ApiError;
}

export interface LumuIncidentPlaceholder {
  status: 'not_configured';
  incidents: [];
  message: string;
}

export interface StatusResponse {
  status: SystemStatus;
  lastSync: string;
  feeds: Record<'news' | 'kev' | 'cves' | 'ransomware', FeedState>;
}
