import { MenuSection } from "@/components/ui/menu-section";
import { menuData } from "@/data/menu";
import { type MenuSection as MenuSectionType } from "@/types/menu";
import { Cake } from "lucide-react";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Menu Hero Section */}
      <section className="relative py-24 overflow-hidden bg-primary/5">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-8">
              <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Cake className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-display text-foreground mb-6">
              Our Menu
            </h1>
            <p className="text-xl md:text-2xl font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover our handcrafted selection of cakes and pastries, each made with love and premium ingredients
            </p>

            {/* Decorative Images */}
            <div className="hidden md:block">
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-32 h-32">
                <Image
                  src={getCloudinaryUrl("/KeilahClassics/IMG_3084.JPG")}
                  alt="Featured Cake 1"
                  fill
                  className="object-cover rounded-full border-4 border-background shadow-xl transform -rotate-12 opacity-80"
                />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-32 h-32">
                <Image
                  src={getCloudinaryUrl("/WeddingCakes/IMG_3113.JPG")}
                  alt="Featured Cake 2"
                  fill
                  className="object-cover rounded-full border-4 border-background shadow-xl transform rotate-12 opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/50" />
      </section>

      {/* Menu Categories */}
      <div className="container mx-auto px-4 py-12">
        {menuData.map((category, index) => (
          <div key={index} className="mb-20 last:mb-0">
            {/* Category Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display text-foreground mb-4">{category.name}</h2>
              <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
            </div>

            {/* Category Sections */}
            <div className="space-y-16">
              {category.sections.map((section: MenuSectionType, sectionIndex: number) => (
                <MenuSection key={sectionIndex} section={section} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order Information */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display text-foreground mb-6">How to Order</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground font-body">
              <ul className="list-none space-y-4 text-center">
                <li>Place your orders 2-3 days before delivery/pick-up</li>
                <li>50% downpayment required for all confirmed orders</li>
                <li>Payment first policy for rush orders</li>
                <li>We accept GCash, BPI, and Union Bank payments</li>
              </ul>
            </div>
            
            <div className="mt-8 p-6 bg-card/50 rounded-xl border border-border/50">
              <p className="font-display text-xl text-foreground mb-2">Contact Us</p>
              <p className="font-body text-muted-foreground">
                📞 +63 927 983 5826
              </p>
              <p className="font-body text-muted-foreground">
                📍 Basak, Lapu-Lapu City
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
