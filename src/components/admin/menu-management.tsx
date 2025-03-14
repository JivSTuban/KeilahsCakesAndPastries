"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  description: string
  price: number
  category: string
  image_url?: string
  created_at: string
}

const categories = [
  "All In One Package",
  "Baby Dedication Cakes",
  "Bento and Combos",
  "Bridal Shower Cakes",
  "Cake in Cups",
  "Customized Cakes",
  "Debut Cakes",
  "Gender Reveal Cakes",
  "Keilah's Classics",
  "Number and Letter Cakes",
  "Wedding Cakes"
]

export function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  
  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchMenuItems()
  }, [selectedCategory])

  const fetchMenuItems = async () => {
    try {
      let query = supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error

      setItems(data || [])
    } catch (error) {
      console.error("Error fetching menu items:", error)
      toast.error("Failed to fetch menu items")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("menu_items")
        .insert([
          {
            name,
            description,
            price: parseFloat(price),
            category,
            image_url: imageUrl || null
          }
        ])

      if (error) throw error

      toast.success("Menu item created successfully")
      resetForm()
      setIsDialogOpen(false)
      fetchMenuItems()
    } catch (error) {
      console.error("Error creating menu item:", error)
      toast.error("Failed to create menu item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast.success("Menu item deleted successfully")
      setItems(items.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast.error("Failed to delete menu item")
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setImageUrl("")
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
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Menu Items</h2>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Menu Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  placeholder="Image URL (optional)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Menu Item"}
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
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No menu items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₱{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
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
