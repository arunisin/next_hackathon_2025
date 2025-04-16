import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const slideInFromRight = {
  initial: { x: "100%" },
  animate: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default async function Page({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const supabase = await createClient();
  const session = supabase.auth.getUser();
  const userId = (await session).data.user?.id;

  const { data: travelData, error } = await supabase
    .from("travel_planner_data")
    .select("*")
    .eq("id", destination)
    .single();

  if (!userId && travelData?.user_id) {
    redirect("/not-found");
  }

  if (error) {
    console.error("Error fetching travel data:", error);
    redirect("/not-found");
  }

  if (!travelData) {
    redirect("/not-found");
  }

  if (travelData?.user_id && travelData.user_id !== userId) {
    redirect("/not-found");
  }

  let parsedData;
  try {
    parsedData = JSON.parse(travelData.data);
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
    return <div>Error loading data.</div>;
  }

  return (
    <div className="view-transition-page w-full max-w-4xl mx-auto p-6 space-y-8 bg-card rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6">{parsedData.destination}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <strong className="text-lg block mb-2">Duration:</strong>
            <span>
              {parsedData.duration?.from} to {parsedData.duration?.to}
            </span>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <strong className="text-lg block mb-2">Weather:</strong>
            <p>{parsedData.weather?.description}</p>
            <p className="text-sm text-muted-foreground">
              {parsedData.weather?.temperature_range}
              <span className="text-xs">
                {" "}
                (via {parsedData.weather?.source})
              </span>
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <strong className="text-lg block mb-2">Timezone:</strong>
            <p>{parsedData.timezone?.name}</p>
            <p className="text-sm text-muted-foreground">
              {parsedData.timezone?.utc_offset}
              <span className="text-xs">
                {" "}
                (via {parsedData.timezone?.source})
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <strong className="text-lg block mb-2">Currency:</strong>
            <p>{parsedData.currency?.name}</p>
            <p className="text-sm text-muted-foreground">
              {parsedData.currency?.symbol} - {parsedData.currency?.code}
              <span className="text-xs">
                {" "}
                (via {parsedData.currency?.source})
              </span>
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <strong className="text-lg block mb-2">Culture:</strong>
            <p className="mb-2">{parsedData.culture?.background}</p>
            <div className="space-y-1">
              {parsedData.culture?.local_customs?.map(
                (custom: string, index: number) => (
                  <p key={index} className="text-sm">
                    • {custom}
                  </p>
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              via {parsedData.culture?.source}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <strong className="text-lg block mb-2">Food and Drinks:</strong>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Local Cuisine:</h3>
              <p className="text-sm">
                {parsedData.food_and_drinks?.local_cuisine?.join(", ")}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Must-try Drinks:</h3>
              <p className="text-sm">
                {parsedData.food_and_drinks?.must_try_drinks?.join(", ")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              via {parsedData.food_and_drinks?.source}
            </p>
          </div>
        </div>

        {parsedData.events_and_festivals &&
          parsedData.events_and_festivals.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <strong className="text-lg block mb-2">
                Events and Festivals:
              </strong>
              <ul className="space-y-2">
                {parsedData.events_and_festivals.map((event: any) => (
                  <li key={event.name} className="text-sm">
                    <span className="font-medium">{event.name}</span> (
                    {event.dates})
                    <p className="text-muted-foreground">{event.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {parsedData.additional_notes && (
          <div className="p-4 bg-muted rounded-lg">
            <strong className="text-lg block mb-2">Additional Notes:</strong>
            <p className="text-sm">{parsedData.additional_notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
