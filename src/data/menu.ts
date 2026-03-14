import { supabase } from "@/lib/supabase";
import { MenuCategory } from "@/types/menu";

export interface SupabaseMenuItem {
  id: number;
  name: string;
  description?: string | null;
  image_url: string;
  category: string;
  status: "available" | "unavailable";
  prices: { size?: string; price: number; details?: string }[];
  is_popular: boolean;
}

interface SupabaseCategory {
  name: string;
  section_title: string;
  section_description: string | null;
  note: string | null;
  display_order: number;
}

export async function getMenuData(): Promise<MenuCategory[]> {
  const [{ data: categories, error: catError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("name, section_title, section_description, note, display_order")
        .order("display_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("id, name, description, image_url, category, status, prices, is_popular")
        .eq("status", "available")
        .order("id", { ascending: true }),
    ]);

  if (catError) throw new Error(`Failed to fetch categories: ${catError.message}`);
  if (itemError) throw new Error(`Failed to fetch menu items: ${itemError.message}`);

  const itemsByCategory = new Map<string, SupabaseMenuItem[]>();
  for (const item of items as SupabaseMenuItem[]) {
    const bucket = itemsByCategory.get(item.category) ?? [];
    bucket.push(item);
    itemsByCategory.set(item.category, bucket);
  }

  return (categories as SupabaseCategory[])
    .filter((cat) => (itemsByCategory.get(cat.name) ?? []).length > 0)
    .map((cat) => ({
      name: cat.name,
      description: cat.section_description ?? undefined,
      note: cat.note ?? undefined,
      sections: [
        {
          title: cat.section_title,
          description: cat.section_description ?? undefined,
          note: cat.note ?? undefined,
          items: (itemsByCategory.get(cat.name) ?? []).map((item) => ({
            name: item.name,
            description: item.description ?? undefined,
            image: item.image_url,
            prices: item.prices,
          })),
        },
      ],
    }));
}
