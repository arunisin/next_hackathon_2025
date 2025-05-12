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
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { PlaneSvg } from "@/components/icons/plane"; // We'll create this next
import { Input } from "../ui/input";
import { MonthSelector } from "../date picker/MonthSelector";

const UserInputs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const router = useRouter();
  const [place, setPlace] = useState<PlaceSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPlaneAnimation, setShowPlaneAnimation] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const destination = params.get("destination");
      const fromDate = params.get("from");
      const toDate = params.get("to");

      if (destination) {
        setPlace({ description: destination } as PlaceSuggestion);
      }

      if (fromDate && toDate) {
        setSelectedMonth(null)
      }
    }
  }, []);

  const handleSignIn = useCallback(() => {
    if (!place || !selectedMonth) return;

    const params = new URLSearchParams();
    params.set("destination", place.description as string);
    if (selectedMonth) {
      params.set("month", selectedMonth);
    }
    params.set("redirect_to", "/protected");

    router.push(`/sign-in?${params.toString()}`);
  }, [place, selectedMonth, router]);

  const handleNavigation = useCallback(async (id: string) => {
    const url = `/destination/${id}`;
    try {
      setShowPlaneAnimation(true);

      // Start view transition
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for plane animation
          window.location.href = url;
        });
      } else {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      setError("Navigation failed. Please try again.");
      setShowPlaneAnimation(false);
    }
  }, []);

  const handleContinueWithoutAuth = async () => {
    setShowSignInDialog(false);
    setIsSubmitting(true);
    setError(null);

    try {
      const gen = await ai_destination_info(
        place!.description as string,
        selectedMonth!,
        place!
      );

      if (gen.id) {
        handleNavigation(gen.id);
      } else {
        setError("Failed to generate travel plan. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!place || !selectedMonth) {
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
      setError(null);

      const gen = await ai_destination_info(
        place.description as string,
        selectedMonth,
        place
      );

      console.log('placetemp', place);

      if (gen.id) {
        handleNavigation(gen.id);
      } else {
        setError("Failed to generate travel plan. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 relative min-w-64">
      <PlaceAutocomplete
        key={'place-autocomplete-input'}
        onPlaceSelect={(selectedPlace) => {
          console.log('selected', selectedPlace);
          setPlace(selectedPlace)}
        }
        initialValue={place?.description}
      />
      {/* <Input onChange={(e) => setPlaceTemp(e.target.value)} /> */}
      <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <Button
        onClick={handleSubmit}
        // disabled={isSubmitting || !place || !dateRange}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Let's go"}
      </Button>

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
      )}

      {showPlaneAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-[plane-takeoff_1s_ease-in-out_forwards]">
            <PlaneSvg className="w-12 h-12 text-primary" />
          </div>
        </div>
      )}

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in Recommended</DialogTitle>
            <DialogDescription>
              Sign in to save your travel plans, or continue without signing in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleContinueWithoutAuth}>
              Continue without signing in
            </Button>
            <Button onClick={handleSignIn}>Sign in</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInputs;
