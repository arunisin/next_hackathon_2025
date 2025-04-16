"use client";
import { ai_destination_info } from "@/app/actions";
import { DatePickerWithRange } from "@/components/date picker/DateRangePicker";
import { PlaceSuggestion } from "@/components/google autocomplete/place_suggestion_types";
import PlaceAutocomplete from "@/components/google autocomplete/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

const UserInputs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const router = useRouter();
  const [place, setPlace] = useState<PlaceSuggestion | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (!place || !dateRange) {
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setShowSignInDialog(true);
        return;
      }

      setIsSubmitting(true);
      const gen = await ai_destination_info(
        place.description as string,
        dateRange
      );
      if (gen.id) {
        router.push("/destination/" + gen.id);
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
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

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              Please sign in to create your travel plan
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSignInDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInputs;
