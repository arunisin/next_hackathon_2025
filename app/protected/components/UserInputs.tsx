"use client";
import { ai_destination_info } from "@/app/actions";
import { DatePickerWithRange } from "@/components/date picker/DateRangePicker";
import { PlaceSuggestion } from "@/components/google autocomplete/place_suggestion_types";
import PlaceAutocomplete from "@/components/google autocomplete/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

const UserInputs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [place, setPlace] = useState<PlaceSuggestion | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [result, setResult] = useState<string | null>(null);
  const handleSubmit = async () => {
    try {
      if (!place || !dateRange) {
        // Show error message
        return;
      }
      setIsSubmitting(true);
      const gen = await ai_destination_info(
        place!.description as string,
        dateRange!
      );
      if (gen.id) {
        router.push("/destination/" + gen.id);
      }
      // Validate inputs
    } catch (error) {
      console.error("Failed to create trip:", error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <PlaceAutocomplete
        onPlaceSelect={(selectedPlace) => setPlace(selectedPlace)}
      />
      <DatePickerWithRange onDateSelect={setDateRange} />
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !place || !dateRange}
      >
        {isSubmitting ? "Processing..." : "Let's go"}
      </Button>

      {result ? <div className="bg-red-300">{result}</div> : null}
    </div>
  );
};

export default UserInputs;
