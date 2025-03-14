import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Review = {
  id?: number;
  name: string;
  rating: number;
  comment: string;
  occasion?: string;
  created_at?: string;
};

export async function submitReview(review: Omit<Review, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}
