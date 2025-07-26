export interface Feedback {
  id: string;            // UUID
  customer_name: string | null;
  message: string | null;
  rating: number | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;    // ISO date string
  updated_at: string;    // ISO date string
}

export type FeedbackInsert = Omit<Feedback, 'id' | 'created_at' | 'updated_at' | 'status'> & {
  status?: string; // Will default to 'approved' in the application
};
