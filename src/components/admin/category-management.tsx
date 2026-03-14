"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
  section_description: string | null
  note: string | null
  created_at: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const [addForm, setAddForm] = useState({ name: "", slug: "", description: "", note: "" })
  const [editForm, setEditForm] = useState({ name: "", slug: "", description: "", note: "" })
  const [editingId, setEditingId] = useState<number | null>(null)


  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, section_description, note, created_at")
        .order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.name.trim()) return
    setIsSaving(true)

    try {
      const slug = addForm.slug.trim() || slugify(addForm.name)
      const { error } = await supabase.from("categories").insert([
        {
          name: addForm.name.trim(),
          slug,
          section_description: addForm.description.trim() || null,
          note: addForm.note.trim() || null,
        },
      ])

      if (error) throw error

      toast.success("Category created successfully")
      setAddForm({ name: "", slug: "", description: "", note: "" })
      setIsAddDialogOpen(false)
      fetchCategories()
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("Failed to create category")
    } finally {
      setIsSaving(false)
    }
  }

  const openEditDialog = (cat: Category) => {
    setEditingId(cat.id)
    setEditForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.section_description ?? "",
      note: cat.note ?? "",
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null || !editForm.name.trim()) return
    setIsSaving(true)

    try {
      const slug = editForm.slug.trim() || slugify(editForm.name)
      const oldCategory = categories.find((c) => c.id === editingId)
      const newName = editForm.name.trim()

      const { error: updateError } = await supabase
        .from("categories")
        .update({
          name: newName,
          slug,
          section_description: editForm.description.trim() || null,
          note: editForm.note.trim() || null,
        })
        .eq("id", editingId)

      if (updateError) throw updateError

      if (oldCategory && oldCategory.name !== newName) {
        await supabase
          .from("menu_items")
          .update({ category: newName })
          .eq("category", oldCategory.name)
      }

      toast.success("Category updated successfully")
      setIsEditDialogOpen(false)
      setEditingId(null)
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const { count } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("category", deleteTarget.name)

      if (count && count > 0) {
        toast.error(
          `Cannot delete: ${count} menu item(s) use this category. Reassign them first.`
        )
        setDeleteTarget(null)
        return
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      toast.success("Category deleted successfully")
      setCategories(categories.filter((c) => c.id !== deleteTarget.id))
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    } finally {
      setDeleteTarget(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">Categories</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
                Add Category
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Name *</Label>
                <Input
                  id="add-name"
                  placeholder="e.g. KEILAH'S CLASSIC CAKES"
                  value={addForm.name}
                  onChange={(e) => {
                    setAddForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: f.slug || slugify(e.target.value),
                    }))
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description (optional)</Label>
                <Textarea
                  id="add-description"
                  placeholder="Brief description shown on the menu page…"
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-note">Note (optional)</Label>
                <Textarea
                  id="add-note"
                  placeholder="e.g. Prices may vary depending on design complexity…"
                  value={addForm.note}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, note: e.target.value }))
                  }
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-slug">Slug (optional)</Label>
                <Input
                  id="add-slug"
                  placeholder="e.g. keilahs-classic-cakes"
                  value={addForm.slug}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, slug: e.target.value }))
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </div>
                ) : (
                  "Add Category"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-lg">
            No categories yet. Add one to get started.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="border rounded-lg p-4 bg-white space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.slug}</p>
                </div>
              </div>
              {cat.section_description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {cat.section_description}
                </p>
              )}
              {cat.note && (
                <p className="text-xs text-muted-foreground italic line-clamp-2">
                  {cat.note}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(cat)}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(cat)}
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-10"
                >
                  No categories yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={cat.section_description ?? undefined}>
                    {cat.section_description || "—"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={cat.note ?? undefined}>
                    {cat.note || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(cat)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(cat)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Pencil className="w-4 h-4 text-blue-600" />
              </div>
              Edit Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g. KEILAH'S CLASSIC CAKES"
                value={editForm.name}
                onChange={(e) => {
                  setEditForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: f.slug || slugify(e.target.value),
                  }))
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description shown on the menu page…"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">Note (optional)</Label>
              <Textarea
                id="edit-note"
                placeholder="e.g. Prices may vary depending on design complexity…"
                value={editForm.note}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, note: e.target.value }))
                }
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug (optional)</Label>
              <Input
                id="edit-slug"
                placeholder="e.g. keilahs-classic-cakes"
                value={editForm.slug}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, slug: e.target.value }))
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget?.name}&rdquo;
              </span>
              ? This can only be done if no menu items use this category.
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
