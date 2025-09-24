export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  images?: string[];
}

export type IssueCategory = 
  | 'pothole'
  | 'electricity'
  | 'water'
  | 'garbage'
  | 'streetlight'
  | 'drainage'
  | 'traffic'
  | 'other';

export type IssueStatus = 
  | 'reported'
  | 'in-progress'
  | 'resolved'
  | 'rejected';

export type IssuePriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';