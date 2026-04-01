import { PastryHero } from "@/components/ui/pastry-hero";
import { CakeCategoryGrid } from "@/components/ui/cake-category-grid";
import { PastryCTA } from "@/components/ui/pastry-cta";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // optionally revalidate every 60s

export default async function Home() {
  const [{ data: heroData }, { data: collectionsData }] = await Promise.all([
    supabase.from("hero_settings").select("display_mode, image_url, images").eq("id", 1).single(),
    supabase.from("collections").select("*").order("category", { ascending: true })
  ]);

  const displayMode = heroData?.display_mode || "slideshow";
  const heroImageUrl = heroData?.image_url || null;
  const heroImages = heroData?.images || [];
  const collections = collectionsData || [];

  return (
    <main className="relative bg-background">
      <div className="relative">
        <PastryHero displayMode={displayMode} heroImageUrl={heroImageUrl} heroImages={heroImages} />
      </div>
      <div className="relative z-10">
        <div className="relative bg-background">
          <CakeCategoryGrid collections={collections} />
        </div>
        <PastryCTA />
      </div>
    </main>
  );
}
