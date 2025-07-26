"use client"

import { Button } from "@/components/ui/button"
import { Clock, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { getCloudinaryUrl } from "@/lib/cloudinary-url"

export function PastryCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Background image for desktop */}
      <div className="absolute inset-0 z-0 hidden sm:block">
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
            className="absolute inset-0 z-[2] bg-gradient-to-r from-primary/90 via-primary/70 to-primary/90"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-[5] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-black/40 p-4 shadow-2xl transition-all duration-500 hover:bg-black/50 sm:p-8 border border-white/10 backdrop-blur-lg">
          {/* Main Content */}
          <div className="mb-4 flex flex-col items-center text-center">
            <motion.h2
              className="mb-4 text-2xl font-display leading-[1.2] text-white drop-shadow-lg sm:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Order Your Dream Cake Today
            </motion.h2>
            <motion.p
              className="font-body mx-auto mb-6 max-w-2xl font-light leading-relaxed text-white drop-shadow text-sm sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Pre-order your custom cake 2-3 days in advance. We accept GCash,
              BPI, and Union Bank payments.
            </motion.p>
            <div className="relative">
              {/* Glowing effect */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/30 via-white/50 to-white/30 opacity-75 blur-xl transition-opacity group-hover:opacity-100"
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="relative border border-white/20 bg-white px-6 py-4 text-sm font-body tracking-wide text-primary shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500 hover:scale-105 hover:bg-white/95 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] sm:px-8 sm:py-6 sm:text-base"
                  asChild
                >
                  <Link
                    href="/menu"
                    className="group flex items-center gap-3"
                  >
                    <span className="relative font-medium">
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
                          ease: "easeInOut",
                        },
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
            className="mt-6 grid grid-cols-1 gap-6 border-t border-white/20 pt-6 sm:grid-cols-2 sm:gap-8 sm:pt-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="space-y-4 sm:space-y-6">
              <h3 className="font-display text-base text-white sm:text-xl">
                Visit Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                  <div>
                    <p className="font-body text-sm text-white sm:text-base">
                      Basak, Lapu-Lapu City
                    </p>
                    <p className="mt-2 text-xs font-body text-white/90 sm:text-sm">
                      Pick-up points:
                    </p>
                    <ul className="mt-1 ml-4 list-disc space-y-1 text-xs font-body text-white/90 sm:text-sm">
                      <li>Mactan Town Center - Basak, LLC</li>
                      <li>Basak Elementary School</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-white" />
                  <span className="font-body text-sm text-white sm:text-base">
                    +63 927 983 5826
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h3 className="font-display text-base text-white sm:text-xl">
                Order Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                  <div>
                    <p className="font-body text-sm text-white sm:text-base">
                      Pre-order Requirements:
                    </p>
                    <ul className="mt-2 ml-4 list-disc space-y-1 text-xs font-body text-white/90 sm:text-sm">
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

      {/* Background for mobile */}
      <div className="absolute inset-0 z-0 sm:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-primary/60 to-background/90" />
      </div>
      
      {/* Image for mobile */}
      <div className="relative h-48 w-full -mb-16 sm:hidden">
        <Image
          src={getCloudinaryUrl("/KeilahClassics/allCakesNoBG.png")}
          alt="Keilah's Classic Cakes"
          fill
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>
    </section>
  )
}
