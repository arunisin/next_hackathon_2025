"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PlaceSuggestion } from "@/components/google autocomplete/place_suggestion_types";
import { DateRange } from "react-day-picker";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { systemPrompt } from "@/lib/utils";

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

export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
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
  duration: DateRange
) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: `Provide travel information for a trip to ${destination}, from ${duration.from}, to ${duration.to} as a json.`,
  });
  const cleanedText = text?.trim();
  const jsonStartIndex = cleanedText?.indexOf("{");
  const jsonEndIndex = cleanedText?.lastIndexOf("}");

  let jsonDataString = cleanedText;
  if (
    jsonStartIndex !== -1 &&
    jsonEndIndex !== -1 &&
    jsonStartIndex < jsonEndIndex
  ) {
    jsonDataString = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1);
  }
  const supabase = await createClient();
  const session = await supabase.auth.getUser();
  const userId = session.data.user?.id;
  const { data: newRecord, error } = await supabase
    .from("travel_planner_data")
    .insert([{ user_id: userId, data: jsonDataString }]) // Insert an array of objects
    .select();

  if (newRecord && newRecord.length > 0) {
    return { id: newRecord[0].id }; // Return the ID of the first inserted row
  } else {
    return { message: "Data inserted successfully, but no ID returned." };
  }
};
