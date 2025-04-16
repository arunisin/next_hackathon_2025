import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import type { TravelPlannerData, DestinationInfo } from "@/lib/types/database";
import { getPexelsImage } from "@/lib/utils";
import { Collapsible } from "@radix-ui/react-collapsible";
import { ChevronsUpDown } from "lucide-react";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Generate static params for all destinations

type Props = {
  params: { destination: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
  const { destination } = params;
  const supabase = await createClient();
  const session = supabase.auth.getUser();
  const userId = (await session).data.user?.id;

  const { data: travelData, error } = await supabase
    .from("travel_planner_data")
    .select("*")
    .eq("id", destination)
    .single<TravelPlannerData>();

  if (!userId && travelData?.user_id) {
    redirect("/not-found");
  }

  if (error || !travelData) {
    redirect("/not-found");
  }

  let parsedData: DestinationInfo;
  try {
    parsedData = JSON.parse(travelData.data);
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
    return <div>Error loading data.</div>;
  }

  // Fetch destination image
  const photo = await getPexelsImage(parsedData.destination);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full min-h-screen pb-20 max-w-7xl">
        {/* Hero Section with Background Image */}
        <div className="relative h-[300px] w-full overflow-hidden">
          {photo ? (
            <>
              {/* Base Image */}
              <Image
                src={photo.src.large}
                alt={`${parsedData.destination} from Pexels by ${photo.photographer}`}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={photo.src.tiny}
                priority
              />
              {/* Blurred Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={photo.src.large}
                  alt=""
                  fill
                  className="object-cover blur-xl scale-110"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8))",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8))",
                  }}
                />
              </div>
              {/* Gradient Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {parsedData.destination}
            </h1>
            <p className="mt-2 text-lg text-white/90 drop-shadow-md">
              Discover the perfect blend of tradition and innovation
            </p>
            {photo?.photographer && (
              <p className="text-sm mt-2 text-white/75">
                Photo by {photo.photographer} on Pexels
              </p>
            )}
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="flex gap-4  px-6 relative z-10">
          <div className="flex-1 rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm ">Temperature</p>
                <p className="font-semibold">
                  {parsedData.weather?.temperature_range || "22°C"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1  rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Time Zone</p>
                <p className="font-semibold">
                  GMT{parsedData.timezone?.utc_offset || "+9"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1  rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-sm text-gray-600">Currency</p>
                <p className="font-semibold">
                  {parsedData.currency?.code || "JPY"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="px-6 py-8 space-y-6">
          {/* Cultural Background */}
          <Collapsible className="w-full">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Cultural Background
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <p className="text-gray-600">
                  {parsedData.culture?.background}
                </p>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Local Customs */}
          <Collapsible className="w-full">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Local Customs
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <ul className="space-y-2">
                  {parsedData.culture?.local_customs?.map(
                    (custom: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span className="text-gray-600">{custom}</span>
                      </li>
                    )
                  )}
                </ul>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Food & Drinks */}
          <Collapsible className="w-full">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Local Food & Drinks
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Local Cuisine
                    </h3>
                    <p className="text-gray-600">
                      {parsedData.food_and_drinks?.local_cuisine?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Must-try Drinks
                    </h3>
                    <p className="text-gray-600">
                      {parsedData.food_and_drinks?.must_try_drinks?.join(", ")}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Language Guide */}
          <Collapsible className="w-full">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Language Guide
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Primary: {parsedData.language?.primary_language}
                  </p>
                  {parsedData.language?.essential_phrases && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Essential Phrases
                      </h3>
                      <ul className="space-y-2">
                        {parsedData.language?.essential_phrases?.map(
                          (phrase: any, index: number) => (
                            <li key={index} className="grid grid-cols-2 gap-2">
                              <span className="text-gray-600">
                                {phrase.phrase}
                              </span>
                              <span className="text-gray-800">
                                {phrase.translation}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Events & Festivals */}
          {parsedData.events_and_festivals &&
            parsedData.events_and_festivals.length > 0 && (
              <Collapsible className="w-full">
                <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
                  <CollapsibleTrigger className="flex w-full text-left">
                    <h2 className="text-xl font-semibold mb-4 w-full">
                      Events & Festivals
                    </h2>
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="w-full">
                    <div className="space-y-4">
                      {parsedData.events_and_festivals.map(
                        (event: any, index: number) => (
                          <div
                            key={index}
                            className="border-b last:border-0 pb-4 last:pb-0"
                          >
                            <h3 className="font-medium text-gray-800">
                              {event.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {event.dates}
                            </p>
                            <p className="text-gray-600 mt-1">
                              {event.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </CollapsibleContent>
                </section>
              </Collapsible>
            )}
        </div>
        {/* <BottomNav /> */}
      </div>
    </div>
  );
}
