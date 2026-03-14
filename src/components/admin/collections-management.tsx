"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"
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
import { Plus, Pencil, Trash2, ImageIcon, LayoutGrid } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────
interface Collection {
  id: string
  category: string
  images: string[]
  created_at: string
  updated_at: string
}

type CollectionFormData = {
  category: string
  image_urls: string[]
}

const EMPTY_FORM: CollectionFormData = {
  category: "",
  image_urls: [],
}

// ─── Component ───────────────────────────────────────────────────────
export function CollectionsManagement() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null)

  // Forms
  const [addForm, setAddForm] = useState<CollectionFormData>({ ...EMPTY_FORM })
  const [editForm, setEditForm] = useState<CollectionFormData>({ ...EMPTY_FORM })
  const [editingId, setEditingId] = useState<string | null>(null)

  // ─── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("category", { ascending: true })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      console.error("Error fetching collections:", error)
      toast.error("Failed to fetch collections")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Add ───────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.category.trim()) return
    setIsSaving(true)

    try {
      const { error } = await supabase.from("collections").insert([
        {
          category: addForm.category.trim(),
          images: addForm.image_urls,
        },
      ])

      if (error) throw error

      toast.success("Collection created successfully")
      setAddForm({ ...EMPTY_FORM })
      setIsAddDialogOpen(false)
      fetchCollections()
    } catch (error) {
      console.error("Error creating collection:", error)
      toast.error("Failed to create collection")
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Edit ──────────────────────────────────────────────────────────
  const openEditDialog = (collection: Collection) => {
    setEditingId(collection.id)
    setEditForm({
      category: collection.category,
      image_urls: collection.images || [],
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null || !editForm.category.trim()) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("collections")
        .update({
          category: editForm.category.trim(),
          images: editForm.image_urls,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)

      if (error) throw error

      toast.success("Collection updated successfully")
      setIsEditDialogOpen(false)
      setEditingId(null)
      fetchCollections()
    } catch (error) {
      console.error("Error updating collection:", error)
      toast.error("Failed to update collection")
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      toast.success("Collection deleted successfully")
      setCollections(collections.filter((c) => c.id !== deleteTarget.id))
    } catch (error) {
      console.error("Error deleting collection:", error)
      toast.error("Failed to delete collection")
    } finally {
      setDeleteTarget(null)
    }
  }

  // ─── Shared Form Renderer ─────────────────────────────────────────
  const renderForm = (
    form: CollectionFormData,
    setForm: React.Dispatch<React.SetStateAction<CollectionFormData>>,
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="form-category" className="text-sm font-medium flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
          Category Name *
        </Label>
        <Input
          id="form-category"
          placeholder="e.g. Customized 1 Tier"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          required
          className="h-11"
        />
      </div>

      {/* Images Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          Images
          <span className="text-xs text-muted-foreground font-normal">(multiple allowed)</span>
        </Label>
        <MultiImageUpload
          values={form.image_urls}
          onChange={(urls) => setForm((f) => ({ ...f, image_urls: urls }))}
        />
      </div>

      <Button type="submit" className="w-full h-11" disabled={isSaving}>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Collections</h2>

        {/* ADD Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                </div>
                Create New Collection
              </DialogTitle>
            </DialogHeader>
            {renderForm(addForm, setAddForm, handleAdd, "Create Collection")}
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {collections.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-lg">
            No collections found. Create one to get started.
          </div>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="border rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-start gap-3">
                {collection.images && collection.images.length > 0 ? (
                  <div className="flex -space-x-2 shrink-0">
                    {collection.images.slice(0, 3).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${collection.category} ${i + 1}`}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                      />
                    ))}
                    {collection.images.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        +{collection.images.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm">{collection.category}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {collection.images?.length || 0} images
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(collection)}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(collection)}
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
              <TableHead>Images</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Image Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No collections found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    {collection.images && collection.images.length > 0 ? (
                      <div className="flex -space-x-2">
                        {collection.images.slice(0, 4).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`${collection.category} ${i + 1}`}
                            className="w-10 h-10 rounded-lg object-cover border-2 border-white"
                          />
                        ))}
                        {collection.images.length > 4 && (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{collection.images.length - 4}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {collection.category}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {collection.images?.length || 0} images
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(collection)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(collection)}
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
              Edit Collection
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
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget?.category}&rdquo;
              </span>{" "}
              collection with {deleteTarget?.images?.length || 0} images? This action cannot be undone.
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
