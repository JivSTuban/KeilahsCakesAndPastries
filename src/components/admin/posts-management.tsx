"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, FileText, ImageIcon, Calendar } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────
interface PostImage {
  id: string
  image_url: string
  display_order: number
}

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  created_at: string
  updated_at: string
  post_images: PostImage[]
}

type PostFormData = {
  title: string
  content: string
  image_urls: string[]
}

const EMPTY_FORM: PostFormData = {
  title: "",
  content: "",
  image_urls: [],
}

// ─── Component ───────────────────────────────────────────────────────
export function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)

  // Forms
  const [addForm, setAddForm] = useState<PostFormData>({ ...EMPTY_FORM })
  const [editForm, setEditForm] = useState<PostFormData>({ ...EMPTY_FORM })
  const [editingId, setEditingId] = useState<number | null>(null)


  // ─── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, post_images(id, image_url, display_order)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Save images helper ────────────────────────────────────────────
  const savePostImages = async (postId: number, imageUrls: string[]) => {
    // Delete existing images for this post
    await supabase.from("post_images").delete().eq("post_id", postId)

    // Insert new images
    if (imageUrls.length > 0) {
      const rows = imageUrls.map((url, index) => ({
        post_id: postId,
        image_url: url,
        display_order: index,
      }))
      const { error } = await supabase.from("post_images").insert(rows)
      if (error) throw error
    }
  }

  // ─── Add ───────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title: addForm.title,
            content: addForm.content,
            image_url: addForm.image_urls[0] || null,
          },
        ])
        .select("id")
        .single()

      if (error) throw error

      // Save images to post_images table
      if (data && addForm.image_urls.length > 0) {
        await savePostImages(data.id, addForm.image_urls)
      }

      toast.success("Post created successfully")
      setAddForm({ ...EMPTY_FORM })
      setIsAddDialogOpen(false)
      fetchPosts()
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Edit ──────────────────────────────────────────────────────────
  const openEditDialog = (post: Post) => {
    setEditingId(post.id)
    const existingImages = (post.post_images || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url)
    
    // Fallback to legacy image_url if no post_images exist
    const imageUrls = existingImages.length > 0
      ? existingImages
      : post.image_url ? [post.image_url] : []

    setEditForm({
      title: post.title,
      content: post.content,
      image_urls: imageUrls,
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: editForm.title,
          content: editForm.content,
          image_url: editForm.image_urls[0] || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)

      if (error) throw error

      // Update images
      await savePostImages(editingId, editForm.image_urls)

      toast.success("Post updated successfully")
      setIsEditDialogOpen(false)
      setEditingId(null)
      fetchPosts()
    } catch (error) {
      console.error("Error updating post:", error)
      toast.error("Failed to update post")
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      toast.success("Post deleted successfully")
      setPosts(posts.filter((p) => p.id !== deleteTarget.id))
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete post")
    } finally {
      setDeleteTarget(null)
    }
  }

  // ─── Shared Form Renderer ─────────────────────────────────────────
  const renderForm = (
    form: PostFormData,
    setForm: React.Dispatch<React.SetStateAction<PostFormData>>,
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="form-title" className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Title *
        </Label>
        <Input
          id="form-title"
          placeholder="e.g. New Holiday Collection Launch"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className="h-11"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="form-content" className="text-sm font-medium">
          Content *
        </Label>
        <Textarea
          id="form-content"
          placeholder="Write your post content here…"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          required
          rows={5}
          className="resize-none"
        />
      </div>

      {/* Images Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          Images
          <span className="text-xs text-muted-foreground font-normal">(optional, multiple allowed)</span>
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
        <h2 className="text-xl font-bold">Posts</h2>

        {/* ADD Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                Create New Post
              </DialogTitle>
            </DialogHeader>
            {renderForm(addForm, setAddForm, handleAdd, "Publish Post")}
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-lg">
            No posts found
          </div>
        ) : (
          posts.map((post) => {
            const images = (post.post_images || [])
              .sort((a, b) => a.display_order - b.display_order)
              .map((img) => img.image_url)
            const displayImages = images.length > 0 ? images : post.image_url ? [post.image_url] : []

            return (
              <div key={post.id} className="border rounded-lg p-4 bg-white space-y-3">
                <div className="flex items-start gap-3">
                  {displayImages.length > 0 ? (
                    <div className="flex -space-x-2 shrink-0">
                      {displayImages.slice(0, 3).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`${post.title} ${i + 1}`}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                        />
                      ))}
                      {displayImages.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{displayImages.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{post.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(post)}
                    className="flex-1 flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(post)}
                    className="flex-1 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Images</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const images = (post.post_images || [])
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((img) => img.image_url)
                const displayImages = images.length > 0 ? images : post.image_url ? [post.image_url] : []

                return (
                  <TableRow key={post.id}>
                    <TableCell>
                      {displayImages.length > 0 ? (
                        <div className="flex -space-x-2">
                          {displayImages.slice(0, 3).map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`${post.title} ${i + 1}`}
                              className="w-10 h-10 rounded-lg object-cover border-2 border-white"
                            />
                          ))}
                          {displayImages.length > 3 && (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                              +{displayImages.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(post)}
                          className="flex items-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(post)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
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
              Edit Post
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
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget?.title}&rdquo;
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
