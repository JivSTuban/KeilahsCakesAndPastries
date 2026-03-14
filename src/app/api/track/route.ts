import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_type, data } = body;

    if (!event_type || !["page_view", "order_clicked"].includes(event_type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    const ip = getClientIp(req);
    if (ip === "unknown") {
      return NextResponse.json({ error: "Could not determine IP" }, { status: 400 });
    }

    const { error } = await supabase.from("events").insert({
      event_type,
      ip_address: ip,
      visitor_id: ip,
      data: data || {},
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ status: "already_tracked" });
      }
      throw error;
    }

    return NextResponse.json({ status: "tracked" });
  } catch (error) {
    console.error("Track event error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
