export interface Database {
  public: {
    Tables: {
      featured_cakes: {
        Row: {
          id: number
          title: string
          description: string
          image_url: string
          price: number
          created_at: string
          category: string
          is_available: boolean
        }
        Insert: {
          id?: number
          title: string
          description: string
          image_url: string
          price: number
          created_at?: string
          category: string
          is_available?: boolean
        }
        Update: {
          id?: number
          title?: string
          description?: string
          image_url?: string
          price?: number
          created_at?: string
          category?: string
          is_available?: boolean
        }
      }
    }
  }
}

export type FeaturedCake = Database['public']['Tables']['featured_cakes']['Row']
export type NewFeaturedCake = Database['public']['Tables']['featured_cakes']['Insert']
export type UpdateFeaturedCake = Database['public']['Tables']['featured_cakes']['Update']
