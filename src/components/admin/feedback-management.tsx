"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
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
  DialogTrigger,
} from "@/components/ui/dialog"

interface Feedback {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  status: "pending" | "approved" | "rejected"
  rating: number
}

export function FeedbackManagement() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  const handleStatusUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id)

      if (error) throw error

      setFeedback(feedback.map(item => 
        item.id === id ? { ...item, status } : item
      ))
      toast.success(`Feedback ${status}`)
    } catch (error) {
      console.error("Error updating feedback:", error)
      toast.error("Failed to update feedback")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return

    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast.success("Feedback deleted successfully")
      setFeedback(feedback.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error deleting feedback:", error)
      toast.error("Failed to delete feedback")
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
        <h2 className="text-xl font-bold">Feedback</h2>
      </div>

      {/* Cleanup Utility */}
      <div className="mb-6">
        <CleanupUtility onCleanupComplete={fetchFeedback} />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No feedback found
                </TableCell>
              </TableRow>
            ) : (
              feedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.rating} / 5</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "approved" 
                        ? "bg-green-100 text-green-800"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFeedback(item)
                        setIsDialogOpen(true)
                      }}
                    >
                      View
                    </Button>
                    {item.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 hover:bg-green-100 text-green-700"
                          onClick={() => handleStatusUpdate(item.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700"
                          onClick={() => handleStatusUpdate(item.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                <p>{selectedFeedback.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                <p>{selectedFeedback.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
                <p className="whitespace-pre-wrap">{selectedFeedback.message}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Rating</h4>
                <p>{selectedFeedback.rating} / 5</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
