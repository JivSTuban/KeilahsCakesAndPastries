import { PastryHero } from "@/components/ui/pastry-hero";
import { CakeCategoryGrid } from "@/components/ui/cake-category-grid";
import { PastryCTA } from "@/components/ui/pastry-cta";

export default function Home() {
  return (
    <main className="relative bg-background">
      <div className="relative">
        <PastryHero />
      </div>
      <div className="relative z-10 mt-[90vh]">
        <div className="relative bg-background">
          <CakeCategoryGrid />
        </div>
        <PastryCTA />
      </div>
    </main>
  );
}
