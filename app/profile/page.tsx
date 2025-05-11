import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TravelPlannerDataWithParsedInfo } from "@/lib/types/database";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch user's travel plans
  const { data: travelPlans } = await supabase
    .from("travel_planner_data")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  const parsedTravelPlans: TravelPlannerDataWithParsedInfo[] =
    travelPlans?.map((plan) => ({
      ...plan,
      data: JSON.parse(plan.data),
    })) || [];

  return (
    <div className="container mx-auto p-4 light-glass-card">
      <h1 className="text-3xl font-bold mb-8 text-white">My Travel Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parsedTravelPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">
              {plan.data.destination}
            </h2>
            <div className="text-sm text-gray-600 mb-4">
              <p>From: {plan.data.duration.from}</p>
              <p>To: {plan.data.duration.to}</p>
            </div>
            <div className="space-y-2">
              <div>
                <h3 className="font-medium">Weather</h3>
                <p className="text-sm text-gray-600">
                  {plan.data.weather.description}
                </p>
              </div>
              {/* <div>
                <h3 className="font-medium">Currency</h3>
                <p className="text-sm text-gray-600">
                  {plan.data.currency.name} ({plan.data.currency.code})
                </p>
              </div> */}
            </div>
            <div className="mt-4">
              <Link 
                href={`/destination/${encodeURIComponent(plan.id)}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details →
              </Link>
              {/* <a
                href={}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details →
              </a> */}
            </div>
          </div>
        ))}
        {parsedTravelPlans.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            You haven't created any travel plans yet.
          </div>
        )}
      </div>
    </div>
  );
}
