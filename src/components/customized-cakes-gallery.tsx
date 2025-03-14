"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Cake = Database['public']['Tables']['cakes']['Row']

export function CustomizedCakesGallery() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCakes() {
      try {
        const { data, error } = await supabase
          .from('cakes')
          .select('*')
          .eq('category_id', 2) // Assuming 2 is the ID for customized cakes category
          .order('name')

        if (error) throw error
        setCakes(data || [])
      } catch (error) {
        console.error('Error fetching customized cakes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCakes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cakes.map((cake, index) => (
        <motion.div
          key={cake.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-64 w-full" style={{ position: 'relative', height: '256px', width: '100%' }}>
              <Image
                src={cake.image_path || "/placeholder.svg"}
                alt={cake.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <Badge className="absolute top-2 right-2 bg-pink-500">{cake.category}</Badge>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{cake.name}</h3>
              <p className="text-gray-600 mb-4">{cake.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-pink-600">₱{cake.price.toLocaleString()}</span>
                <Button
                  asChild
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <a
                    href={`https://m.me/100083042506670?msg=I%20am%20interested%20in%20${encodeURIComponent(cake.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}