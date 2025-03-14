"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  image_url?: string
}

interface FeaturedOrderResponse {
  id: number
  menu_item_id: number
  created_at: string
  menu_items: MenuItem
}

interface FeaturedOrder {
  id: number
  created_at: string
  menu_item: MenuItem
}

export function FeaturedManagement() {
  const [featured, setFeatured] = useState<FeaturedOrder[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string>("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch featured orders with menu item details
      const { data: featuredData, error: featuredError } = await supabase
        .from("featured_orders")
        .select(`
          id,
          menu_item_id,
          created_at,
          menu_items:menu_items!inner (
            id,
            name,
            category,
            price,
            image_url
          )
        `)
        .order("created_at", { ascending: false })
        .returns<Array<{
          id: number;
          menu_item_id: number;
          created_at: string;
          menu_items: MenuItem;
        }>>()

      if (featuredError) throw featuredError

      // Fetch all menu items for the select dropdown
      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("id, name, category, price, image_url")
        .order("name")

      if (menuError) throw menuError

      const orders = (featuredData || []).map((order: { id: number; created_at: string; menu_items: MenuItem }) => ({
        id: order.id,
        created_at: order.created_at,
        menu_item: {
          id: order.menu_items.id,
          name: order.menu_items.name,
          category: order.menu_items.category,
          price: order.menu_items.price,
          image_url: order.menu_items.image_url
        }
      }))
      setFeatured(orders)
      setMenuItems(menuData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItemId) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("featured_orders")
        .insert([{ menu_item_id: parseInt(selectedItemId) }])

      if (error) throw error

      toast.success("Featured order added successfully")
      setSelectedItemId("")
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Error adding featured order:", error)
      toast.error("Failed to add featured order")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this featured order?")) return

    try {
      const { error } = await supabase
        .from("featured_orders")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast.success("Featured order removed successfully")
      setFeatured(featured.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error removing featured order:", error)
      toast.error("Failed to remove featured order")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Featured Orders</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Featured Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Featured Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                value={selectedItemId}
                onValueChange={setSelectedItemId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select menu item" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} - {item.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full" disabled={isLoading || !selectedItemId}>
                {isLoading ? "Adding..." : "Add to Featured"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featured.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No featured orders found
                </TableCell>
              </TableRow>
            ) : (
              featured.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.menu_item.name}</TableCell>
                  <TableCell>{item.menu_item.category}</TableCell>
                  <TableCell>₱{item.menu_item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
