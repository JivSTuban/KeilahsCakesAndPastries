"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
export function PastryCTA() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          <Image
            src={getCloudinaryUrl("/KeilahClassics/allCakesNoBG.png")}
            alt="Keilah's Classic Cakes"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        
          <div 
            className="absolute inset-0 z-[2] bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80" 
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-[5] mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-black/40 p-6 sm:p-10 backdrop-blur-lg transition-all duration-500 hover:bg-black/50 md:p-14 shadow-2xl border border-white/10">
          {/* Main Content */}
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.h2 
              className="mb-6 text-2xl sm:text-3xl md:text-5xl font-display text-white leading-[1.2] drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Order Your Dream Cake Today
            </motion.h2>
            <motion.p 
              className="mb-8 text-white text-base sm:text-lg font-body font-light leading-relaxed max-w-xl mx-auto drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Pre-order your custom cake 2-3 days in advance. We accept GCash, BPI, and Union Bank payments.
            </motion.p>
            <div className="relative">
              {/* Glowing effect */}
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30 rounded-full opacity-75 group-hover:opacity-100 blur-xl transition-opacity"
                animate={{
                  opacity: [0.5, 0.7, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="relative bg-white hover:bg-white/95 text-primary px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg font-body tracking-wide 
                    transition-all duration-500 hover:scale-105
                    shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]
                    border border-white/20"
                  asChild
                >
                  <Link href="/menu" className="group flex items-center gap-2">
                    <span className="relative">
                      Place an Order
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                    <motion.span
                      className="inline-block"
                      animate={{
                        x: [0, 4, 0],
                        transition: {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      →
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Contact Info and Business Details */}
          <motion.div 
            className="mt-12 grid gap-10 border-t border-white/20 pt-10 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-display text-white">Visit Us</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-white mt-1" />
                  <div>
                    <p className="font-body text-white">Basak, Lapu-Lapu City</p>
                    <p className="text-sm font-body text-white/90 mt-2">Pick-up points:</p>
                    <ul className="text-sm font-body text-white/90 list-disc ml-5 mt-1 space-y-1">
                      <li>Mactan Town Center - Basak, LLC</li>
                      <li>Basak Elementary School</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-white" />
                  <span className="font-body text-white">+63 927 983 5826</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display text-white">Order Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-white mt-1" />
                  <div>
                    <p className="font-body text-white">Pre-order Requirements:</p>
                    <ul className="text-sm font-body text-white/90 list-disc ml-5 mt-2 space-y-2">
                      <li>Place orders 2-3 days before delivery/pick-up</li>
                      <li>50% downpayment for confirmed orders</li>
                      <li>Payment first policy for rush orders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
