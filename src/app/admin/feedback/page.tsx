"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Feedback } from "@/types/feedback";

export default function AdminFeedback() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setFeedback(data || []);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error: updateError } = await supabase
        .from("feedback")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) throw updateError;
      await loadFeedback();
    } catch (err) {
      console.error("Error updating feedback:", err);
      setError("Failed to update feedback status");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display">Customer Feedback</h1>
            <Button onClick={() => loadFeedback()} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-6">
            {feedback.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-6 rounded-lg border bg-card/50",
                  item.status === 'approved' && "border-green-500/20",
                  item.status === 'rejected' && "border-red-500/20",
                  item.status === 'pending' && "border-yellow-500/20"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {item.customer_name || "Anonymous"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Rating: {item.rating || "No rating"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={item.status === 'approved' ? 'default' : 'outline'}
                      onClick={() => updateStatus(item.id, 'approved')}
                      className={cn(
                        item.status === 'approved' && "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant={item.status === 'rejected' ? 'default' : 'outline'}
                      onClick={() => updateStatus(item.id, 'rejected')}
                      className={cn(
                        item.status === 'rejected' && "bg-red-600 hover:bg-red-700"
                      )}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
                
                {item.message && (
                  <p className="mt-4 text-muted-foreground">
                    {item.message}
                  </p>
                )}

                <div className="mt-2 text-sm text-muted-foreground">
                  Status: <span className={cn(
                    "font-medium",
                    item.status === 'approved' && "text-green-600",
                    item.status === 'rejected' && "text-red-600",
                    item.status === 'pending' && "text-yellow-600"
                  )}>
                    {item.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}

            {!isLoading && feedback.length === 0 && (
              <p className="text-center text-muted-foreground">
                No feedback submissions yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
