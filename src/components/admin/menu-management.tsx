"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, Star, CheckCircle, XCircle, UtensilsCrossed, X } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

// ─── Types ───────────────────────────────────────────────────────────
export interface PriceVariant {
  size?: string
  price: number
  details?: string
}

interface MenuItem {
  id: number
  name: string
  description?: string | null
  prices: PriceVariant[]
  image_url: string
  is_popular: boolean
  category: string
  status: "available" | "unavailable"
  created_at: string
}

// Row shape while editing (all strings for controlled inputs)
type PriceRow = {
  size: string
  price: string
  details: string
}

type MenuItemFormData = {
  name: string
  description: string
  prices: PriceRow[]
  image_url: string
  is_popular: boolean
  category: string
  status: "available" | "unavailable"
}

const BLANK_PRICE_ROW: PriceRow = { size: "", price: "", details: "" }

const EMPTY_FORM: MenuItemFormData = {
  name: "",
  description: "",
  prices: [{ ...BLANK_PRICE_ROW }],
  image_url: "",
  is_popular: false,
  category: "",
  status: "available",
}

const CATEGORY_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
]

// ─── Helpers ─────────────────────────────────────────────────────────
function variantsToRows(variants: PriceVariant[]): PriceRow[] {
  return variants.map((v) => ({
    size: v.size ?? "",
    price: v.price.toString(),
    details: v.details ?? "",
  }))
}

function rowsToVariants(rows: PriceRow[]): PriceVariant[] {
  return rows
    .filter((r) => r.price !== "")
    .map((r) => ({
      ...(r.size ? { size: r.size } : {}),
      price: parseFloat(r.price),
      ...(r.details ? { details: r.details } : {}),
    }))
}

/** Returns a compact display string like "₱650 – ₱1,150" */
function formatPriceRange(variants: PriceVariant[]): string {
  if (!variants || variants.length === 0) return "—"
  const prices = variants.map((v) => v.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return `₱${min.toLocaleString()}`
  return `₱${min.toLocaleString()} – ₱${max.toLocaleString()}`
}

// ─── Component ───────────────────────────────────────────────────────
interface DbCategory {
  id: number
  name: string
  slug: string
}

export function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null)

  // Filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Forms
  const [addForm, setAddForm] = useState<MenuItemFormData>({ ...EMPTY_FORM, prices: [{ ...BLANK_PRICE_ROW }] })
  const [editForm, setEditForm] = useState<MenuItemFormData>({ ...EMPTY_FORM, prices: [{ ...BLANK_PRICE_ROW }] })
  const [editingId, setEditingId] = useState<number | null>(null)


  // ─── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchMenuItems()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true })
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    }
  }

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

  // ─── Add ───────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await supabase.from("menu_items").insert([
        {
          name: addForm.name,
          description: addForm.description.trim() || null,
          prices: rowsToVariants(addForm.prices),
          image_url: addForm.image_url,
          is_popular: addForm.is_popular,
          category: addForm.category,
          status: addForm.status,
        },
      ])

      if (error) throw error

      toast.success("Menu item created successfully")
      setAddForm({ ...EMPTY_FORM, prices: [{ ...BLANK_PRICE_ROW }] })
      setIsAddDialogOpen(false)
      fetchMenuItems()
    } catch (error) {
      console.error("Error creating menu item:", error)
      toast.error("Failed to create menu item")
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Edit ──────────────────────────────────────────────────────────
  const openEditDialog = (item: MenuItem) => {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      description: item.description ?? "",
      prices: item.prices?.length ? variantsToRows(item.prices) : [{ ...BLANK_PRICE_ROW }],
      image_url: item.image_url,
      is_popular: item.is_popular,
      category: item.category,
      status: item.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: editForm.name,
          description: editForm.description.trim() || null,
          prices: rowsToVariants(editForm.prices),
          image_url: editForm.image_url,
          is_popular: editForm.is_popular,
          category: editForm.category,
          status: editForm.status,
        })
        .eq("id", editingId)

      if (error) throw error

      toast.success("Menu item updated successfully")
      setIsEditDialogOpen(false)
      setEditingId(null)
      fetchMenuItems()
    } catch (error) {
      console.error("Error updating menu item:", error)
      toast.error("Failed to update menu item")
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      toast.success("Menu item deleted successfully")
      setItems(items.filter((item) => item.id !== deleteTarget.id))
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast.error("Failed to delete menu item")
    } finally {
      setDeleteTarget(null)
    }
  }

  // ─── Status Toggle ────────────────────────────────────────────────
  const toggleStatus = async (item: MenuItem) => {
    const newStatus = item.status === "available" ? "unavailable" : "available"

    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ status: newStatus })
        .eq("id", item.id)

      if (error) throw error

      setItems(
        items.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      )
      toast.success(
        `${item.name} is now ${newStatus === "available" ? "available" : "unavailable"}`
      )
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update status")
    }
  }

  // ─── Price Rows Editor ────────────────────────────────────────────
  const renderPriceRows = (
    form: MenuItemFormData,
    setForm: React.Dispatch<React.SetStateAction<MenuItemFormData>>
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Prices & Sizes *</Label>
        <button
          type="button"
          onClick={() =>
            setForm((f) => ({ ...f, prices: [...f.prices, { ...BLANK_PRICE_ROW }] }))
          }
          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Size Variant
        </button>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr_1fr_1.5fr_auto] gap-2 px-1">
        <span className="text-xs text-muted-foreground">Size</span>
        <span className="text-xs text-muted-foreground">Price (₱) *</span>
        <span className="text-xs text-muted-foreground">Details</span>
        <span />
      </div>

      {form.prices.map((row, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_1fr_1.5fr_auto] gap-2 items-center">
          <Input
            placeholder="e.g. 6x3"
            value={row.size}
            onChange={(e) =>
              setForm((f) => {
                const updated = [...f.prices]
                updated[idx] = { ...updated[idx], size: e.target.value }
                return { ...f, prices: updated }
              })
            }
            className="h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="650"
            min="0"
            step="1"
            value={row.price}
            required
            onChange={(e) =>
              setForm((f) => {
                const updated = [...f.prices]
                updated[idx] = { ...updated[idx], price: e.target.value }
                return { ...f, prices: updated }
              })
            }
            className="h-9 text-sm"
          />
          <Input
            placeholder="e.g. Starting price"
            value={row.details}
            onChange={(e) =>
              setForm((f) => {
                const updated = [...f.prices]
                updated[idx] = { ...updated[idx], details: e.target.value }
                return { ...f, prices: updated }
              })
            }
            className="h-9 text-sm"
          />
          <button
            type="button"
            disabled={form.prices.length === 1}
            onClick={() =>
              setForm((f) => ({
                ...f,
                prices: f.prices.filter((_, i) => i !== idx),
              }))
            }
            className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )

  // ─── Shared Form Renderer ─────────────────────────────────────────
  const renderForm = (
    form: MenuItemFormData,
    setForm: React.Dispatch<React.SetStateAction<MenuItemFormData>>,
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string,
    disableSubmit?: boolean
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="form-name">Name *</Label>
        <Input
          id="form-name"
          placeholder="e.g. Chocolate Fudge Cake"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="form-description">Description (optional)</Label>
        <Textarea
          id="form-description"
          placeholder="Rich chocolate cake with fudge frosting…"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category *</Label>
        {categories.length === 0 ? (
          <p className="text-sm text-amber-600">
            Add categories in the Categories tab first.
          </p>
        ) : (
        <Select
          value={form.category}
          onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white p-1">
            {categories.map((cat, idx) => (
              <SelectItem
                key={cat.id}
                value={cat.name}
                className="rounded-lg p-0 focus:bg-primary/5 data-[state=checked]:bg-primary/5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 py-2 px-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0 ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}`}
                  >
                    {cat.name.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        )}
      </div>

      {/* Dynamic Prices */}
      {renderPriceRows(form, setForm)}

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Image *</Label>
        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
          required
        />
      </div>

      {/* Status & Popular Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v: "available" | "unavailable") =>
              setForm((f) => ({ ...f, status: v }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <label className="flex items-center gap-2 h-10 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_popular}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_popular: e.target.checked }))
              }
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Mark as Popular</span>
            <Star className="w-4 h-4 text-amber-500" />
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSaving || disableSubmit}>
        {isSaving ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving…
          </div>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Menu Items</h2>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
          <SelectContent className="bg-white p-1">
              <SelectItem value="All" className="rounded-lg focus:bg-primary/5 cursor-pointer">
                <div className="flex items-center gap-2 py-0.5">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-sm bg-gray-100">✨</span>
                  <span className="text-sm font-medium">All Categories</span>
                </div>
              </SelectItem>
              {categories.map((cat, idx) => (
                <SelectItem
                  key={cat.id}
                  value={cat.name}
                  className="rounded-lg p-0 focus:bg-primary/5 data-[state=checked]:bg-primary/5 cursor-pointer"
                >
                  <div className="flex items-center gap-2 py-1.5 px-1">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-sm shrink-0 ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}`}>
                      {cat.name.charAt(0)}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ADD Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
              </div>
              Create New Menu Item
            </DialogTitle>
            </DialogHeader>
            {renderForm(addForm, setAddForm, handleAdd, "Create Menu Item", categories.length === 0)}
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-lg">
            No menu items found
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-start gap-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 shrink-0">
                    N/A
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    {item.is_popular && (
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                  <p className="text-sm font-medium mt-1">{formatPriceRange(item.prices)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {item.prices?.filter((v) => v.size).map((v, i) => (
                  <span
                    key={i}
                    className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {v.size}
                  </span>
                ))}
                <button
                  onClick={() => toggleStatus(item)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ml-auto ${
                    item.status === "available"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {item.status === "available" ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {item.status === "available" ? "Available" : "Unavailable"}
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(item)}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
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
              <TableHead>Price Range</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead className="text-center">Popular</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-10"
                >
                  No menu items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-medium text-sm">
                    {formatPriceRange(item.prices)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.prices?.filter((v) => v.size).map((v, i) => (
                        <span
                          key={i}
                          className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {v.size}
                        </span>
                      ))}
                      {!item.prices?.some((v) => v.size) && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_popular && (
                      <Star className="w-4 h-4 text-amber-500 mx-auto fill-amber-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        item.status === "available"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      title={`Click to mark as ${item.status === "available" ? "unavailable" : "available"}`}
                    >
                      {item.status === "available" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {item.status === "available"
                        ? "Available"
                        : "Unavailable"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* EDIT Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Pencil className="w-4 h-4 text-blue-600" />
              </div>
              Edit Menu Item
            </DialogTitle>
          </DialogHeader>
          {renderForm(editForm, setEditForm, handleEdit, "Save Changes")}
        </DialogContent>
      </Dialog>

      {/* DELETE Confirmation Modal */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget?.name}&rdquo;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
