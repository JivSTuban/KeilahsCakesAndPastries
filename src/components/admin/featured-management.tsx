"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Star, Calendar, Sparkles } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────
interface PriceVariant {
  size?: string
  price: number
  details?: string
}

interface MenuItem {
  id: number
  name: string
  category: string
  prices: PriceVariant[]
  image_url?: string
}

function startingPrice(variants: PriceVariant[]): string {
  if (!variants?.length) return "—"
  const min = Math.min(...variants.map((v) => v.price))
  const max = Math.max(...variants.map((v) => v.price))
  if (min === max) return `₱${min.toLocaleString()}`
  return `₱${min.toLocaleString()} – ₱${max.toLocaleString()}`
}

interface FeaturedOrder {
  id: number
  created_at: string
  menu_item: MenuItem
}

// ─── Component ───────────────────────────────────────────────────────
export function FeaturedManagement() {
  const [featured, setFeatured] = useState<FeaturedOrder[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [deleteTarget, setDeleteTarget] = useState<FeaturedOrder | null>(null)


  // ─── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
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
            prices,
            image_url
          )
        `)
        .order("created_at", { ascending: false })
        .returns<Array<{
          id: number
          menu_item_id: number
          created_at: string
          menu_items: MenuItem
        }>>()

      if (featuredError) throw featuredError

      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("id, name, category, prices, image_url")
        .order("name")

      if (menuError) throw menuError

      const orders = (featuredData || []).map(
        (order: { id: number; created_at: string; menu_items: MenuItem }) => ({
          id: order.id,
          created_at: order.created_at,
          menu_item: order.menu_items,
        })
      )
      setFeatured(orders)
      setMenuItems(menuData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Add ───────────────────────────────────────────────────────────
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

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const { error } = await supabase
        .from("featured_orders")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      toast.success("Featured order removed successfully")
      setFeatured(featured.filter((item) => item.id !== deleteTarget.id))
    } catch (error) {
      console.error("Error removing featured order:", error)
      toast.error("Failed to remove featured order")
    } finally {
      setDeleteTarget(null)
    }
  }

  // ─── Selected item preview ────────────────────────────────────────
  const selectedItem = menuItems.find(
    (item) => item.id.toString() === selectedItemId
  )

  // ─── Render ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Featured Orders</h2>

        {/* ADD Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Featured Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                Add Featured Order
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  Select Menu Item *
                </Label>
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a menu item to feature" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 bg-white p-1">
                    {menuItems.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No menu items available. Add some first.
                      </div>
                    ) : (
                      menuItems.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="rounded-lg p-0 focus:bg-primary/5 data-[state=checked]:bg-primary/5 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 py-2 px-2 w-full">
                            {/* Thumbnail */}
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border/40"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <Star className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            {/* Info */}
                            <div className="flex flex-col min-w-0 gap-0.5">
                              <span className="font-medium text-sm text-gray-900 truncate leading-tight">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded">
                                  {item.category}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-medium">
                                  {startingPrice(item.prices)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {selectedItem && (
                <div className="rounded-xl border bg-muted/30 p-4 flex items-center gap-4">
                  {selectedItem.image_url ? (
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{selectedItem.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
                    <p className="text-sm font-medium text-primary">
                      {startingPrice(selectedItem.prices)}
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading || !selectedItemId}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding…
                  </div>
                ) : (
                  "Add to Featured"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {featured.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-lg">
            No featured orders found
          </div>
        ) : (
          featured.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-start gap-3">
                {item.menu_item.image_url ? (
                  <img
                    src={item.menu_item.image_url}
                    alt={item.menu_item.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate">{item.menu_item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.menu_item.category}</p>
                  <p className="text-sm font-medium mt-1">{startingPrice(item.menu_item.prices)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(item)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featured.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  No featured orders found
                </TableCell>
              </TableRow>
            ) : (
              featured.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.menu_item.image_url ? (
                      <img
                        src={item.menu_item.image_url}
                        alt={item.menu_item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Star className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.menu_item.name}
                  </TableCell>
                  <TableCell>{item.menu_item.category}</TableCell>
                  <TableCell>{startingPrice(item.menu_item.prices)}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(item)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DELETE Confirmation Modal */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Featured Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget?.menu_item.name}&rdquo;
              </span>{" "}
              from featured orders? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
