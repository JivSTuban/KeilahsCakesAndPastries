import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const getDescription = (categoryName: string): string => {
  switch (categoryName) {
    case "Wedding Cakes":
      return "Elegant multi-tiered masterpieces perfect for your special day";
    case "Customized 1 Tier":
      return "Personalized single-tier cakes for any occasion";
    case "Customized 2 Tier":
      return "Elegant double-tier cakes with custom designs";
    case "Customized 3 Tier":
      return "Grand three-tier cakes for special celebrations";
    case "Number and Letter":
      return "Personalized cakes shaped as numbers or letters for unique celebrations";
    case "Baby Dedication":
      return "Sweet creations to celebrate your little one's special milestone";
    case "All in One Package":
      return "Complete celebration packages with cake, cupcakes, and number designs";
    case "Debut Cakes":
      return "Stunning cakes for the perfect 18th birthday celebration";
    case "Bento and Combos":
      return "Special cake and treat combinations for sharing";
    default:
      return "";
  }
};

const getCategoryId = (name: string): string | undefined => {
  switch (name) {
    case "Customized 3 Tier":
      return "wedding";
    case "Customized 2 Tier":
      return "birthday";
    case "Baby Dedication":
      return "baby-dedication";
    case "Number and Letter":
      return "number-cakes";
    case "Customized 1 Tier":
      return "custom";
    default:
      return undefined;
  }
};

type Collection = {
  id: string;
  category: string;
  images: string[];
};

async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("id, category, images")
    .order("category");

  if (error) throw error;
  return data ?? [];
}

export default async function FeaturedPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen bg-background">

      {/* Collections */}
      <div className="space-y-24 py-16">
        {collections.map((collection, index) => {
          const id = getCategoryId(collection.category);
          return (
            <div key={collection.id} id={id} className="space-y-8">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-display text-foreground text-center mb-3">{collection.category}</h2>
                <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                  {getDescription(collection.category)}
                </p>
              </div>

              <div className="relative">
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <InfiniteSlider
                  duration={80}
                  durationOnHover={120}
                  gap={32}
                  reverse={index % 2 === 1}
                  className="py-4"
                >
                  {collection.images.map((src, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative aspect-square w-[300px] rounded-xl overflow-hidden shadow-lg"
                    >
                      <Image
                        src={src}
                        alt={`${collection.category} ${imgIndex + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </InfiniteSlider>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display text-foreground mb-6">Ready to Order?</h2>
            <p className="text-lg font-body text-muted-foreground mb-8">
              Let us create the perfect cake for your special occasion
            </p>
            <div className="p-6 bg-card/50 rounded-xl border border-border/50">
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
