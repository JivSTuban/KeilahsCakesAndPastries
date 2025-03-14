import { MenuSection } from "@/components/ui/menu-section";
import { menuData } from "@/data/menu";
import { Cake } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Menu Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <Cake className="h-8 w-8 text-primary" />
              <h1 className="text-5xl md:text-6xl font-display text-foreground">Our Menu</h1>
            </div>
            <p className="text-xl font-body text-muted-foreground leading-relaxed">
              Discover our handcrafted selection of cakes and pastries, each made with love and premium ingredients
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
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
              {category.sections.map((section, sectionIndex) => (
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
