import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  // Get travel parameters from the URL
  const destination = requestUrl.searchParams.get("destination");
  const fromDate = requestUrl.searchParams.get("from");
  const toDate = requestUrl.searchParams.get("to");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // If we have destination parameters, redirect back to home with them
  if (destination) {
    const params = new URLSearchParams();
    params.set("destination", destination);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    return NextResponse.redirect(`${origin}/?${params.toString()}`);
  }

  // Default redirect if no destination parameters
  return NextResponse.redirect(`${origin}/protected`);
}
