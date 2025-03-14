"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Award, Clock, Cake, MapPin, Phone } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every cake is crafted with passion and attention to detail"
  },
  {
    icon: Award,
    title: "Quality Ingredients",
    description: "We use only premium ingredients for the best taste and quality"
  },
  {
    icon: Clock,
    title: "Fresh & Timely",
    description: "Cakes are freshly baked and delivered right on schedule"
  }
];

const EXPERTISE = [
  "Wedding Cakes",
  "Birthday Cakes",
  "Baby Dedication Cakes",
  "Number & Letter Cakes",
  "Custom Designs",
  "Themed Cakes"
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* About Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <h1 className="text-5xl md:text-6xl font-display text-foreground">About Us</h1>
            </div>
            <p className="text-xl font-body text-muted-foreground leading-relaxed">
              Crafting sweet memories, one cake at a time
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl" style={{ position: 'relative', height: '400px' }}>
                <Image
                  src="/KeilahClassics/IMG_3082.JPG"
                  alt="Keilah's Classic Cake"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-4xl font-display text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 font-body text-muted-foreground">
                  <p>
                    Welcome to Keilah's Cakes & Pastries, where we transform simple ingredients into extraordinary creations that make your special moments even more memorable.
                  </p>
                  <p>
                    Located in Basak, Lapu-Lapu City, we specialize in crafting beautiful and delicious cakes for all occasions. From elegant wedding cakes to fun birthday creations, each piece is made with love and attention to detail.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display text-foreground mb-4">Our Values</h2>
              <p className="text-lg font-body text-muted-foreground">
                The principles that guide our craft
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {VALUES.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-card/50 border border-border/50 rounded-xl p-8 text-center"
                >
                  <value.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display text-foreground mb-2">{value.title}</h3>
                  <p className="font-body text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display text-foreground mb-4">Our Expertise</h2>
              <p className="text-lg font-body text-muted-foreground">
                Specializing in a variety of cake designs and styles
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {EXPERTISE.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card/50 border border-border/50 rounded-lg p-6 text-center"
                >
                  <p className="font-display text-foreground">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display text-foreground mb-8">Visit Our Shop</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card/50 rounded-xl border border-border/50 p-6">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg text-foreground mb-2">Location</h3>
                <p className="font-body text-muted-foreground">Basak, Lapu-Lapu City</p>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  Pick-up points:
                  <br />Mactan Town Center & Basak Elementary School
                </p>
              </div>
              <div className="bg-card/50 rounded-xl border border-border/50 p-6">
                <Phone className="h-6 w-6 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg text-foreground mb-2">Contact Us</h3>
                <p className="font-body text-muted-foreground">+63 927 983 5826</p>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  We accept GCash, BPI, and Union Bank payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
