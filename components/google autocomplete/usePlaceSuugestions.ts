import { place_suggestion } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import debounce from "lodash.debounce";

// Function to fetch place suggestions
const fetchPlaceSuggestion = async (query: string) => {
  if (!query) return []; // Return empty array if query is empty
  const places = await place_suggestion(query);
  return places;
};

// Custom hook for place suggestions with debounce and React Query
export const usePlaceSuggestion = (initialQuery: string = "") => {
  const [query, setQuery] = useState(initialQuery);

  // Create a debounced function to update the query
  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), 300),
    []
  );

  // The query key includes the query string to ensure refetching when it changes
  const result = useQuery({
    queryKey: ["placeSuggestions", query],
    queryFn: () => fetchPlaceSuggestion(query),
    enabled: query.length > 0, // Only run the query when there's something to search
  });

  return {
    ...result,
    query,
    setQuery: debouncedSetQuery,
  };
};