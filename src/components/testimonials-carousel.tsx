"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setTestimonials(data || [])
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }, [testimonials.length])

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  if (loading || testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 px-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-md"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-md"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="overflow-hidden py-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="px-4"
          >
            <Card className="bg-white shadow-lg border-pink-100 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-pink-100 flex-shrink-0">
                    <Image
                      src={testimonials[currentIndex].image_path || "/placeholder-user.jpg"}
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-2">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-pink-500 text-pink-500" />
                      ))}
                      {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gray-300" />
                      ))}
                    </div>
                    <p className="text-lg italic mb-4">"{testimonials[currentIndex].message}"</p>
                    <h3 className="text-xl font-bold text-pink-600">{testimonials[currentIndex].name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-pink-500" : "bg-pink-200"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

