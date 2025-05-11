"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PlaceSuggestion } from "@/components/google autocomplete/place_suggestion_types";
import { DateRange } from "react-day-picker";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getPlaceImage, systemPrompt } from "@/lib/utils";
import { DestinationInfoSchema } from "@/lib/ai/schemas/destination-info";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const signInWithGoogleAction = async (formData: FormData) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Get redirect params from form data
  const destination = formData.get("destination")?.toString();
  const fromDate = formData.get("from")?.toString();
  const toDate = formData.get("to")?.toString();

  let redirectUrl = `${origin}/auth/callback`;

  // If we have destination params, add them to the callback URL
  if (destination) {
    const params = new URLSearchParams();
    params.set("destination", destination);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    redirectUrl += `?${params.toString()}`;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const place_suggestion = async (query: string) => {
  const supabase = await createClient();
  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
  // const { data: session } = await supabase.auth.getSession();
  // if (session.session) {
  // const { data: cachedSuggestions, error } = await supabase
  //   .from("places_suggestions")
  //   .select("suggestions")
  //   .eq("query", query)
  //   .single();

  // if (error) {
  //   console.error("Error querying Supabase:", error);
  // }

  // if (cachedSuggestions && cachedSuggestions.suggestions) {
  //   console.log("Cache hit for:------------------", query);
  //   return cachedSuggestions.suggestions as PlaceSuggestion[];
  // }
  // }
  const googlePlacesApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query
  )}&key=${googleApiKey}`;

  const googleResponse = await fetch(googlePlacesApiUrl);
  const googleData = await googleResponse.json();
  if (googleData.status === "OK" && googleData.predictions) {
    const suggestions = googleData.predictions;
    console.log("from google");
    const { error: insertError } = await supabase
      .from("places_suggestions")
      .upsert({ query, suggestions }, { onConflict: "query" });

    if (insertError) {
      console.error("Error inserting/upserting data:", insertError.message);
    }
    return suggestions as PlaceSuggestion[];
  }
};

export const ai_destination_info = async (
  destination: string,
  duration: DateRange,
  place: PlaceSuggestion
) => {
  const currentDate = new Date();
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: `Create a comprehensive travel guide for ${destination} for a trip from ${duration.from} to ${duration.to}.

Please provide extensive details for each section, including:
- Current seasonal weather patterns and climate information
- Detailed transportation options with current prices
- Rich cultural context and customs
- Specific local food recommendations with where to try them
- Authentic shopping experiences and local markets
- Detailed neighborhood/district guides
- Up-to-date practical information (visa, safety, etc.)
- Current prices and cost estimates
- Seasonal events and festivals during the travel period
- Comprehensive attraction details with visiting tips

Focus on providing specific, actionable information that helps travelers make informed decisions. Include local insights and insider tips where possible. Make sure all information is current as of ${currentDate.toLocaleDateString()}.

Important: Ensure every section in the response includes a "source" field with attribution.
For date fields, use the format: YYYY-MM-DD
For currency fields, include both local currency and USD equivalent.
Each array should contain at least 2-3 items.

Return the information as a complete JSON object following the schema exactly.`,
  });

  if (!text) {
    throw new Error("No response from AI");
  }

  // Clean and parse the JSON response
  let cleanedText = text.trim();

  // Remove any markdown code block markers
  cleanedText = cleanedText.replace(/^```json\s*/, "");
  cleanedText = cleanedText.replace(/^```\s*/, "");
  cleanedText = cleanedText.replace(/\s*```$/, "");

  // Find the actual JSON content
  const firstBrace = cleanedText.indexOf("{");
  const lastBrace = cleanedText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error("Could not find valid JSON content in AI response");
  }

  // Extract just the JSON object
  const jsonContent = cleanedText.slice(firstBrace, lastBrace + 1);

  let parsedData;
  try {
    const photoResponse = await getPlaceImage(place.place_id);

    parsedData = JSON.parse(jsonContent);
    parsedData = {
      ...parsedData, 
      place_data: JSON.stringify(place),
      place_img: JSON.stringify(photoResponse)
    }
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.error("Attempted to parse:", jsonContent);
    throw new Error("Failed to parse AI response as JSON");
  }

  // Validate the data against our schema
  const result = DestinationInfoSchema.safeParse(parsedData);

  console.log('object', result.data);

  if (!result.success) {
    // Log detailed validation errors
    console.error("Schema Validation Errors:");
    const formattedErrors = result.error.format();
    console.error(JSON.stringify(formattedErrors, null, 2));

    // Create a more helpful error message
    const errorPaths = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    throw new Error(`AI response validation failed:\n${errorPaths.join("\n")}`);
  }

  // Store in database
  const supabase = await createClient();
  const session = await supabase.auth.getUser();
  const userId = session.data.user?.id;



  const { data: newRecord, error } = await supabase
    .from("travel_planner_data")
    .insert([
      {
        user_id: userId,
        data: JSON.stringify({
          ...result.data,
          
        }), // Store the validated data
      },
    ])
    .select();

  if (error) {
    throw new Error("Failed to save destination info");
  }

  if (newRecord && newRecord.length > 0) {
    return {
      id: newRecord[0].id,
      data: result.data, // Return the validated data
    };
  }

  throw new Error("Failed to save destination info");
};
