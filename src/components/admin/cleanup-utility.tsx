"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { Trash2, AlertTriangle } from "lucide-react";

export function CleanupUtility({ onCleanupComplete }: { onCleanupComplete?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const cleanupPlaceholderFeedback = async () => {
    setIsLoading(true);
    setResult("");
    setError("");

    try {
      // Get all feedback to review first
      const { data: allFeedback, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Identify placeholder entries
      const placeholderEntries = allFeedback?.filter(item => {
        const name = item.customer_name?.toLowerCase() || '';
        const message = item.message?.toLowerCase() || '';
        
        return (
          // Placeholder names
          ['still jiv', 'jiv tuban', 'asd', 'test', 'test user'].includes(name) ||
          // Placeholder messages
          ['asd', 'test', 'ad'].includes(message) ||
          // Very short messages
          (message.length > 0 && message.length < 5) ||
          // Empty or null content
          (!name && !message)
        );
      }) || [];

      if (placeholderEntries.length === 0) {
        setResult("No placeholder feedback found to clean up.");
        return;
      }

      // Delete placeholder entries
      const idsToDelete = placeholderEntries.map(item => item.id);
      
      const { error: deleteError } = await supabase
        .from('feedback')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) throw deleteError;

      setResult(`Successfully removed ${placeholderEntries.length} placeholder feedback entries.`);
      
      // Trigger refresh if callback provided
      if (onCleanupComplete) {
        onCleanupComplete();
      }
      
    } catch (err: any) {
      console.error('Error cleaning up feedback:', err);
      setError(err.message || 'Failed to cleanup placeholder feedback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Cleanup Utility</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Remove placeholder and test feedback entries from the database.
      </p>

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{result}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={cleanupPlaceholderFeedback}
        disabled={isLoading}
        variant="destructive"
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        {isLoading ? "Cleaning up..." : "Remove Placeholder Feedback"}
      </Button>
    </div>
  );
}
