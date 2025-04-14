import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    .eq("id", destination) // Assuming 'destination' is a key within your JSON 'data' column
    .single(); // Expecting only one row with this destination

  console.log(travelData);

  if (!userId && travelData.user_id) {
    // If no user is logged in, we can't check ownership
    // You might want to handle this differently based on your app's logic
    // For now, let's assume unauthenticated users can't view specific posts
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
    <div>
      <h1>{parsedData.destination}</h1>
      <div>
        <strong>Duration:</strong> {parsedData.duration?.from} to{" "}
        {parsedData.duration?.to}
      </div>
      <div>
        <strong>Weather:</strong> {parsedData.weather?.description} (
        {parsedData.weather?.temperature_range}, sourced from{" "}
        {parsedData.weather?.source})
      </div>
      <div>
        <strong>Timezone:</strong> {parsedData.timezone?.name} (
        {parsedData.timezone?.utc_offset}, sourced from{" "}
        {parsedData.timezone?.source})
      </div>
      <div>
        <strong>Currency:</strong> {parsedData.currency?.name} (
        {parsedData.currency?.symbol} - {parsedData.currency?.code}, sourced
        from {parsedData.currency?.source})
      </div>
      <div>
        <strong>Culture:</strong>
        <p>
          {parsedData.culture?.background} (sourced from{" "}
          {parsedData.culture?.source})
        </p>
        <ul>
          {parsedData.culture?.local_customs?.map(
            (custom: string, index: number) => <li key={index}>{custom}</li>
          )}
        </ul>
      </div>
      <div>
        <strong>Food and Drinks:</strong>
        <p>
          <strong>Local Cuisine:</strong>{" "}
          {parsedData.food_and_drinks?.local_cuisine?.join(", ")} (sourced from{" "}
          {parsedData.food_and_drinks?.source})
        </p>
        <p>
          <strong>Must-try Drinks:</strong>{" "}
          {parsedData.food_and_drinks?.must_try_drinks?.join(", ")}
        </p>
      </div>
      <div>
        <strong>Language:</strong>
        <p>
          <strong>Primary Language:</strong>{" "}
          {parsedData.language?.primary_language}
        </p>
        <ul>
          {/* {parsedData.language?.essential_phrases?.map((phraseObj, index) => (
            <li key={index}>
              {phraseObj.phrase}: {phraseObj.translation}
            </li>
          ))} */}
        </ul>
        <p>{parsedData.language?.translator_link_suggestion}</p>
      </div>
      {parsedData.events_and_festivals &&
        parsedData.events_and_festivals.length > 0 && (
          <div>
            <strong>Events and Festivals:</strong>
            <ul>
              {/* {parsedData.events_and_festivals.map((event) => (
                <li key={event.name}>
                  {event.name} ({event.dates}): {event.description} (sourced
                  from {event.source})
                </li>
              ))} */}
            </ul>
          </div>
        )}
      {parsedData.additional_notes && (
        <div>
          <strong>Additional Notes:</strong>
          <p>{parsedData.additional_notes}</p>
        </div>
      )}
    </div>
  );
}
