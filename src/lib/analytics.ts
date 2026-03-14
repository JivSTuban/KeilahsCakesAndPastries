const TRACKED_PAGE_VIEW_KEY = "keilahs_tracked_pv";
const TRACKED_ORDER_CLICK_KEY = "keilahs_tracked_oc";

async function sendTrackEvent(
  eventType: "page_view" | "order_clicked",
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType, data }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json.status === "tracked" || json.status === "already_tracked";
  } catch {
    return false;
  }
}

/**
 * Tracks a unique page view by IP address.
 * The server extracts the real client IP and enforces uniqueness via a DB unique index.
 * localStorage is used as a fast-path to avoid redundant network calls.
 */
export async function trackPageView(path: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(TRACKED_PAGE_VIEW_KEY)) return;

  const success = await sendTrackEvent("page_view", {
    path,
    referrer: document.referrer || null,
  });

  if (success) {
    sessionStorage.setItem(TRACKED_PAGE_VIEW_KEY, "true");
  }
}

/**
 * Tracks a unique order click by IP address.
 * The server extracts the real client IP and enforces uniqueness via a DB unique index.
 * localStorage is used as a fast-path to avoid redundant network calls.
 */
export async function trackOrderClick(itemName?: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(TRACKED_ORDER_CLICK_KEY)) return;

  const success = await sendTrackEvent("order_clicked", {
    item: itemName || null,
    path: window.location.pathname,
  });

  if (success) {
    sessionStorage.setItem(TRACKED_ORDER_CLICK_KEY, "true");
  }
}
