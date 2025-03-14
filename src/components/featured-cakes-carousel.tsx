"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Cake = Database['public']['Tables']['cakes']['Row']

const getInitialItemsPerView = () => {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
}

export function FeaturedCakesCarousel() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(getInitialItemsPerView)
  const [visibleCakes, setVisibleCakes] = useState<number[]>([])
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function fetchCakes() {
      try {
        const { data, error } = await supabase
          .from('cakes')
          .select('*')
          .eq('is_popular', true)
          .order('name')

        if (error) throw error
        setCakes(data || [])
      } catch (error) {
        console.error('Error fetching cakes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCakes()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (cakes.length === 0) return
    const indices = []
    for (let i = 0; i < itemsPerView; i++) {
      indices.push((currentIndex + i) % cakes.length)
    }
    setVisibleCakes(indices)
  }, [currentIndex, itemsPerView, cakes.length])

  const nextSlide = useCallback(() => {
    if (cakes.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cakes.length)
  }, [cakes.length])

  const prevSlide = useCallback(() => {
    if (cakes.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cakes.length) % cakes.length)
  }, [cakes.length])

  useEffect(() => {
    if (cakes.length === 0) return
    autoPlayRef.current = setInterval(nextSlide, 5000)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [nextSlide, cakes.length])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }

    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden">
        <div className="flex gap-6">
          <AnimatePresence initial={false}>
            {visibleCakes.map((index, i) => (
              <motion.div
                key={`${cakes[index].id}-${i}`}
                className={`flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 w-full" style={{ position: 'relative', height: '256px' }}>
                    <Image
                      src={cakes[index].image_path || "/placeholder.svg"}
                      alt={cakes[index].name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {cakes[index].is_popular && (
                      <Badge className="absolute top-2 right-2 bg-primary text-white">Popular</Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{cakes[index].name}</h3>
                      <span className="text-lg font-semibold text-primary">
                        ₱{cakes[index].price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{cakes[index].description}</p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white group">
                      <Link href={`/menu`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {cakes.length > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white hover:bg-primary/10 border-primary/20"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white hover:bg-primary/10 border-primary/20"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
