"use client";
import { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { usePlaceSuggestion } from "./usePlaceSuugestions";
import { Input } from "../ui/input";
import { PlaceSuggestion } from "./place_suggestion_types";

interface PlaceAutocompleteProps {
  onPlaceSelect?: (place: PlaceSuggestion) => void;
  placeholder?: string;
  className?: string;
  minChars?: number;
  initialValue?: string;
}

const PlaceAutocomplete = ({
  onPlaceSelect,
  placeholder = "Search for a place...",
  className,
  minChars = 2,
  initialValue,
}: PlaceAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue || "");
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: suggestions,
    isLoading,
    query,
    setQuery,
  } = usePlaceSuggestion();

  const handleSelect = (place: any) => {
    console.log('place', place);
    setQuery(place.description);
    setInputValue(place.description);
    setOpen(false);
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update the input value immediately for responsive UI

    // Only trigger search if we have more than minChars
    if (value.length >= minChars) {
      setQuery(value);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialValue && !query) {
      setQuery(initialValue);
    }
  }, [initialValue, query, setQuery]);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue.length >= minChars) {
            setOpen(true);
          }
        }}
        className="w-full"
      />

      {open && (
        <div className="absolute w-full mt-1 bg-background rounded-md border shadow-md z-10">
          <Command className="rounded-lg border">
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading places...
                </div>
              ) : suggestions && suggestions.length > 0 ? (
                <CommandGroup>
                  {suggestions.map((place) => (
                    <CommandItem
                      key={`dropdownList-suggestion-${place.place_id}`}
                      value={place.description}
                      onSelect={() => handleSelect(place)}
                      className="cursor-pointer"
                    >
                      {place.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                query.length > 0 && (
                  <CommandEmpty>No places found.</CommandEmpty>
                )
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
