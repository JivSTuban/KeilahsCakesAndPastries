"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CleanupUtility } from "@/components/admin/cleanup-utility"
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
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────
interface Feedback {
  id: number
  customer_name: string
  message: string
  rating: number
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

// ─── Component ───────────────────────────────────────────────────────
export function FeedbackManagement() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null)


  // ─── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setFeedback(data || [])
    } catch (error) {
      console.error("Error fetching feedback:", error)
      toast.error("Failed to fetch feedback")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Status Update ────────────────────────────────────────────────
  const handleStatusUpdate = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error

      setFeedback(
        feedback.map((item) => (item.id === id ? { ...item, status } : item))
      )
      toast.success(`Feedback ${status}`)
    } catch (error) {
      console.error("Error updating feedback:", error)
      toast.error("Failed to update feedback")
    }
  }

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      toast.success("Feedback deleted successfully")
      setFeedback(feedback.filter((item) => item.id !== deleteTarget.id))
    } catch (error) {
      console.error("Error deleting feedback:", error)
      toast.error("Failed to delete feedback")
    } finally {
      setDeleteTarget(null)
    }
  }

  // ─── Status badge ─────────────────────────────────────────────────
  const renderStatusBadge = (status: string) => {
    const config = {
      approved: {
        bg: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-3.5 h-3.5" />,
      },
      rejected: {
        bg: "bg-red-100 text-red-700",
        icon: <XCircle className="w-3.5 h-3.5" />,
      },
      pending: {
        bg: "bg-amber-100 text-amber-700",
        icon: <Clock className="w-3.5 h-3.5" />,
      },
    }[status] || {
      bg: "bg-gray-100 text-gray-700",
      icon: <Clock className="w-3.5 h-3.5" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg}`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // ─── Star rating ──────────────────────────────────────────────────
  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-amber-500 fill-amber-500"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
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
        <h2 className="text-xl font-bold">Feedback</h2>
      </div>

      {/* Cleanup Utility */}
      <div className="mb-6">
        <CleanupUtility onCleanupComplete={fetchFeedback} />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {feedback.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-lg">
            No feedback found
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <h3 className="font-medium text-sm truncate">{item.customer_name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                {renderStatusBadge(item.status)}
              </div>
              <div>{renderStars(item.rating)}</div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.message}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFeedback(item)
                    setIsViewDialogOpen(true)
                  }}
                  className="flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>
                {item.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 flex items-center gap-1"
                      onClick={() => handleStatusUpdate(item.id, "approved")}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 flex items-center gap-1"
                      onClick={() => handleStatusUpdate(item.id, "rejected")}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </>
                )}
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
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-10"
                >
                  No feedback found
                </TableCell>
              </TableRow>
            ) : (
              feedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.customer_name}
                  </TableCell>
                  <TableCell>{renderStars(item.rating)}</TableCell>
                  <TableCell>{renderStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFeedback(item)
                          setIsViewDialogOpen(true)
                        }}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                      {item.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 flex items-center gap-1"
                            onClick={() =>
                              handleStatusUpdate(item.id, "approved")
                            }
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 flex items-center gap-1"
                            onClick={() =>
                              handleStatusUpdate(item.id, "rejected")
                            }
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                        </>
                      )}
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

      {/* VIEW Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-purple-50 rounded-lg">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              Feedback Details
            </DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-5">
              {/* Customer Info Card */}
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedFeedback.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        selectedFeedback.created_at
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {renderStars(selectedFeedback.rating)}
                  {renderStatusBadge(selectedFeedback.status)}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Message
                </h4>
                <p className="text-sm whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-lg p-3 border">
                  {selectedFeedback.message}
                </p>
              </div>

              {/* Action Buttons */}
              {selectedFeedback.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleStatusUpdate(selectedFeedback.id, "approved")
                      setIsViewDialogOpen(false)
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleStatusUpdate(selectedFeedback.id, "rejected")
                      setIsViewDialogOpen(false)
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
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
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete feedback from{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget?.customer_name}&rdquo;
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
