/**
 * Triggers on-demand revalidation of the given Next.js paths.
 * Call this from client components after any admin mutation so the
 * server-rendered public pages immediately reflect the new data.
 */
export async function revalidatePaths(paths: string[]): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Non-critical: the page will eventually revalidate on next request
    console.warn("Failed to trigger revalidation for paths:", paths);
  }
}
