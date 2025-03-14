"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useState } from "react"

type Cake = Database['public']['Tables']['cakes']['Row']

export function WeddingCakesGallery() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCakes() {
      try {
        const { data, error } = await supabase
          .from('cakes')
          .select('*')
          .eq('category_id', 1) // Assuming 1 is the ID for wedding cakes category
          .order('name')

        if (error) throw error
        setCakes(data || [])
      } catch (error) {
        console.error('Error fetching wedding cakes:', error)
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
            <div className="relative h-64 w-full" style={{ position: 'relative', height: '256px' }}>
              <Image
                src={cake.image_path || "/placeholder.svg"}
                alt={cake.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{cake.name}</h3>
              <p className="text-gray-600 mb-4">{cake.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-pink-600">₱{cake.price.toLocaleString()}</span>
                <Button
                  asChild
                  className="bg-pink-600 hover:bg-pink-700"
                  onClick={() => window.open(`https://m.me/100083042506670?msg=I%20am%20interested%20in%20${encodeURIComponent(cake.name)}`, '_blank')}
                >
                  <a
                    href={`https://m.me/100083042506670?msg=I%20am%20interested%20in%20${encodeURIComponent(cake.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Inquire Now
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

function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.")
}
