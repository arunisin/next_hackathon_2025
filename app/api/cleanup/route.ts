import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    // Verify the request is from a cron job using a secret key
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET_KEY;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Delete entries older than 14 days where user_id is null
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data, error } = (await supabase
      .from("travel_planner_data")
      .delete()
      .is("user_id", null)
      .lt("created_at", fourteenDaysAgo.toISOString())) as {
      data: { id: string }[] | null;
      error: any;
    };

    if (error) {
      console.error("Cleanup error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Cleanup completed successfully",
      deletedCount: data?.length || 0,
    });
  } catch (error) {
    console.error("Cleanup failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
