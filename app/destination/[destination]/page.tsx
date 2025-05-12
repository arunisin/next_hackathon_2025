import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Banknote,
  ThermometerSun,
  Bus,
  Building,
  ShoppingBag,
  AlertTriangle,
  Landmark,
  CalendarDays,
  DollarSign,
  ChevronsUpDown,
} from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import type { TravelPlannerData, DestinationInfo } from "@/lib/types/database";
import { getPexelsImage, getPlaceImage } from "@/lib/utils";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PlaceSuggestion } from "@/components/google autocomplete/place_suggestion_types";
import { PlaceImage } from "@/components/google places/place_image";

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
    .single<TravelPlannerData>();

  if (!userId && travelData?.user_id) {
    redirect("/not-found");
  }

  if (error || !travelData) {
    redirect("/not-found");
  }

  let parsedData: DestinationInfo;
  let placeData: PlaceSuggestion;
  let placeImg: PlaceImage

  try {
    parsedData = JSON.parse(travelData.data);
    placeData = JSON.parse(parsedData.place_data);
    placeImg = JSON.parse(parsedData.place_img);
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
    return <div>Error loading data.</div>;
  }
  // Fetch destination image
  // const photo = await getPexelsImage(parsedData.destination);
  // const photoResponse = await getPlaceImage(placeData.place_id);
  const imgUrl = placeImg.imageUrl ?? null

  console.log('parsedData.weather', parsedData.weather);

  return (
    <div className="flex flex-col justify-center text-white h-screen-minus-header overflow-scroll">
      {imgUrl ? (
        <div
          className="w-full aspect-square relative"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          {/* Base Image */}
          <Image
            src={imgUrl}
            alt={`${parsedData.destination}`}
            fill
            className="object-cover"
            priority
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Content */}
          <div className="absolute flex flex-col justify-end p-6 z-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {parsedData.destination}
            </h1>
            <p className="mt-2 text-lg text-white/90 drop-shadow-md">
              Discover the perfect blend of tradition and innovation
            </p>
          </div>
      </div>
      ) : (
        <div className="relative w-full h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gray-200" >Image not loaded</div>
        </div>
      )}

      <div className="flex fade-top-mask -mt-72 pt-24 z-10 flex-col w-full overflow-scroll p-4 gap-4 ">
        {/* Hero Section with Background Image */}
        
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10 ">
          <div className="rounded-lg shadow-md p-4 dense-glass-card">
            <div className="flex items-center space-x-2">
              <div className=" flex flex-col gap-2">
                <div className=" flex gap-2">
                  <ThermometerSun className="w-5 h-5 text-white" />
                  <p className="text-md font-bold ">Weather</p>
                </div>
                <hr className=" bg-white" />
                <p className="font-semibold">
                  {parsedData.weather?.temperature_range}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-md p-4 dense-glass-card">
            <div className="flex items-center space-x-2">
              <Bus className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm ">Transport</p>
                <p className="font-semibold">Available</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-md p-4 col-span-2 md:col-span-1 dense-glass-card">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm ">Time Zone</p>
                <p className="font-semibold">
                  GMT <span className=" font-light text-sm line-clamp-2">{parsedData.weather?.source || "N/A"}</span>
                </p>
              </div>
            </div>
          </div>


        </div>

        {/* Main Content Sections */}
        <div className="flex flex-col gap-4">
          {/* Cultural Background */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Cultural Background
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <p className="">
                  {parsedData.culture?.background}
                </p>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Transportation */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Transportation
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Public Transport Options
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsedData.transportation?.public_transport.map(
                      (transport, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800">
                            {transport.type}
                          </h4>
                          <p className=" mt-1">
                            {transport.description}
                          </p>
                          <p className="text-gray-500 mt-2">
                            Cost: {transport.cost_range}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Airport Transportation
                  </h3>
                  <ul className="list-disc pl-4 space-y-2">
                    {parsedData.transportation?.getting_from_airport.map(
                      (tip, index) => (
                        <li key={index} className="">
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Local Transport Tips
                  </h3>
                  <ul className="list-disc pl-4 space-y-2">
                    {parsedData.transportation?.local_tips.map((tip, index) => (
                      <li key={index} className="">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Districts */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Districts & Areas
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="grid md:grid-cols-2 gap-6">
                  {parsedData.districts?.map((district, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {district.name}
                      </h3>
                      <p className=" mb-3">
                        {district.description}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Known For:
                          </h4>
                          <ul className="list-disc pl-4">
                            {district.known_for.map((item, i) => (
                              <li key={i} className="">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Highlights:
                          </h4>
                          <ul className="list-disc pl-4">
                            {district.highlights.map((item, i) => (
                              <li key={i} className="">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Weather & Seasonal Info */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Weather & Seasons
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <p className=" mb-4">
                  {parsedData.weather?.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {parsedData.weather?.seasonal_info.map((season, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {season.season}
                      </h3>
                      <p className=" mb-2">{season.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Temperature:</span>
                          <p className="text-gray-700">{season.temperature}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Precipitation:</span>
                          <p className="text-gray-700">
                            {season.precipitation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Practical Information */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Practical Information
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Visa Requirements
                  </h3>
                  <p className="">
                    {parsedData.practical_info?.visa_requirements}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Health & Safety
                  </h3>
                  <ul className="list-disc pl-4 space-y-2">
                    {parsedData.practical_info?.health_safety.map(
                      (tip, index) => (
                        <li key={index} className="">
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Emergency Contacts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {parsedData.practical_info?.emergency_contacts.map(
                      (contact, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-700">
                            {contact.service}
                          </p>
                          <p className="">{contact.number}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Best Time to Visit
                  </h3>
                  <div className="space-y-2">
                    <p className="">
                      <span className="font-medium">General:</span>{" "}
                      {parsedData.practical_info?.best_time_to_visit.general}
                    </p>
                    <p className="">
                      <span className="font-medium">Peak Season:</span>{" "}
                      {
                        parsedData.practical_info?.best_time_to_visit
                          .peak_season
                      }
                    </p>
                    <p className="">
                      <span className="font-medium">Off Season:</span>{" "}
                      {parsedData.practical_info?.best_time_to_visit.off_season}
                    </p>
                    <p className="">
                      <span className="font-medium">Shoulder Season:</span>{" "}
                      {
                        parsedData.practical_info?.best_time_to_visit
                          .shoulder_season
                      }
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Local Customs */}
          <Collapsible className="w-full dense-glass-card">
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
                        <span className="">{custom}</span>
                      </li>
                    )
                  )}
                </ul>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Food & Drinks */}
          <Collapsible className="w-full dense-glass-card">
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
                    <p className="">
                      {parsedData.food_and_drinks?.local_cuisine?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Must-try Drinks
                    </h3>
                    <p className="">
                      {parsedData.food_and_drinks?.must_try_drinks?.join(", ")}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Shopping */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">Shopping</h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Local Markets
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsedData.shopping?.markets.map((market, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800">
                          {market.name}
                        </h4>
                        <p className=" mt-1">
                          {market.description}
                        </p>
                        <p className="text-gray-500 mt-2">
                          <span className="font-medium">Location:</span>{" "}
                          {market.location}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-medium">Best Times:</span>{" "}
                          {market.best_times}
                        </p>
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700">
                            Specialties:
                          </h5>
                          <ul className="list-disc pl-4">
                            {market.specialties.map((specialty, i) => (
                              <li key={i} className="">
                                {specialty}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Recommended Souvenirs
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {parsedData.shopping?.souvenirs.map((souvenir, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="">{souvenir}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Shopping Areas
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsedData.shopping?.shopping_areas.map((area, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Cost of Living */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Cost of Living
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Daily Budget
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium text-gray-800">
                        {parsedData.cost_of_living?.budget_per_day.budget}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <p className="text-sm text-gray-500">Mid-Range</p>
                      <p className="font-medium text-gray-800">
                        {parsedData.cost_of_living?.budget_per_day.mid_range}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <p className="text-sm text-gray-500">Luxury</p>
                      <p className="font-medium text-gray-800">
                        {parsedData.cost_of_living?.budget_per_day.luxury}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Common Expenses
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsedData.cost_of_living?.common_expenses.map(
                      (expense, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded flex justify-between"
                        >
                          <span className="">{expense.item}</span>
                          <span className="font-medium text-gray-800">
                            {expense.cost_range}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Language Guide */}
          <Collapsible className="w-full dense-glass-card">
            <section className="rounded-lg shadow p-6 hover:shadow-lg transition-shadow w-full">
              <CollapsibleTrigger className="flex w-full text-left">
                <h2 className="text-xl font-semibold mb-4 w-full">
                  Language Guide
                </h2>
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Primary Language
                    </h3>
                    <p className="">
                      {parsedData.language?.primary_language}
                    </p>
                  </div>
                  {parsedData.language?.essential_phrases && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-4">
                        Essential Phrases
                      </h3>
                      <div className="grid gap-3">
                        {parsedData.language?.essential_phrases?.map(
                          (phrase: any, index: number) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded border flex justify-between items-center"
                            >
                              <div className="flex-1">
                                <p className="text-gray-800">{phrase.phrase}</p>
                                <p className="text-gray-500 text-sm italic mt-1">
                                  {phrase.translation}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Events & Festivals */}
          {parsedData.events_and_festivals &&
            parsedData.events_and_festivals.length > 0 && (
              <Collapsible className="w-full dense-glass-card">
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
                            <p className=" mt-1">
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
