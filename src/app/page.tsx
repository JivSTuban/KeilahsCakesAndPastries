import { PastryHero } from "@/components/ui/pastry-hero";
import { CakeCategoryGrid } from "@/components/ui/cake-category-grid";
import { PastryCTA } from "@/components/ui/pastry-cta";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <PastryHero />
      <div className="relative bg-background">
        <div className="relative z-[1]">
          <CakeCategoryGrid />
        </div>
        <div className="relative z-[2]">
          <PastryCTA />
        </div>
      </div>
    </main>
  );
}
