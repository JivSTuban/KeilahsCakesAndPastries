import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Featured", href: "/featured" },
  { name: "About", href: "/about" },
  { name: "Feedback", href: "/feedback" }
];

const SPECIALTY_LINKS = [
  { name: "Wedding Cakes", href: "/menu#wedding" },
  { name: "Birthday Cakes", href: "/menu#birthday" },
  { name: "Baby Dedication", href: "/menu#baby-dedication" },
  { name: "Number Cakes", href: "/menu#number-cakes" },
  { name: "Custom Designs", href: "/menu#custom" }
];

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/placeholder-logo.png"
                alt="Keilah's Pastries"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xl font-display text-primary">Keilah's</span>
                <span className="text-sm font-body text-muted-foreground tracking-wider uppercase">
                  Cakes & Pastries
                </span>
              </div>
            </Link>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">
              Crafting delicious moments with our handmade cakes and pastries. Each creation is made with love and premium ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-foreground text-lg mb-4">Quick Links</h3>
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

          {/* Our Specialties */}
          <div>
            <h3 className="font-display text-foreground text-lg mb-4">Our Specialties</h3>
            <ul className="space-y-2">
              {SPECIALTY_LINKS.map((link) => (
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

          {/* Contact Information */}
          <div>
            <h3 className="font-display text-foreground text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
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
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm font-body text-muted-foreground">
                  +63 927 983 5826
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-body text-muted-foreground">
                  Pre-order: 2-3 days advance
                </span>
              </li>
              <li className="flex items-center gap-3 mt-4">
                <Link
                  href="https://facebook.com/keilahspastriesndesserts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-border/50">
          <p className="text-center text-sm font-body text-muted-foreground">
            © {new Date().getFullYear()} Keilah's Cakes & Pastries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
