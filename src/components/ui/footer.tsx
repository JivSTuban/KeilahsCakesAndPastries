import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Featured", href: "/featured" },
  { name: "Feedback", href: "/feedback" }
];

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-2 space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={getCloudinaryUrl("/keilahs-logo.jpg")}
                alt="Keilah's Pastries"
                width={40}
                height={40}
                className="h-10 w-auto rounded-full"
                priority
              />
              <div className="flex flex-col">
                <span className="text-xl font-display text-primary">Keilah's</span>
                <span className="text-xs sm:text-sm font-body text-muted-foreground tracking-wider uppercase">
                  Cakes & Pastries
                </span>
              </div>
            </Link>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">
              Crafting delicious moments with our handmade cakes and pastries. Each creation is made with love and premium ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-display text-foreground text-base sm:text-lg mb-2 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Credits */}
          <div className="space-y-3">
            <h3 className="font-display text-foreground text-base sm:text-lg mb-2 sm:mb-4">Developer</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://jivstuban.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
                >
                  Jiv Tuban
                </Link>
              </li>
              <li>
                <Link
                  href="https://rotosystems.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
                >
                  roto.
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 space-y-3 md:col-span-1">
            <h3 className="font-display text-foreground text-base sm:text-lg mb-2 sm:mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-body text-muted-foreground">
                    Basak, Lapu-Lapu City
                  </p>
                  <p className="text-xs font-body text-muted-foreground mt-1">
                    Pick-up: Mactan Town Center & Basak Elementary School
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
                  +63 927 983 5826
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
                  Pre-order: 2-3 days advance
                </span>
              </li>
              <li className="flex items-center gap-4 mt-4">
                <Link
                  href="https://facebook.com/keilahspastriesndesserts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/50 sm:mt-12">
          <p className="text-center text-xs sm:text-sm font-body text-muted-foreground">
            © {new Date().getFullYear()} Keilah's Cakes & Pastries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
