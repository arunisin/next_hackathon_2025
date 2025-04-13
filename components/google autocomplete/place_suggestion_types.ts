export type PlaceSuggestion = {
  description: string; // Full description of the place (e.g., "New York, NY, USA")
  place_id: string; // Unique identifier for the place
  structured_formatting: {
    main_text: string; // Main part of the place name (e.g., "New York")
    secondary_text: string; // Secondary part of the place name (e.g., "NY, USA")
  };
  types: string[]; // Types of the place (e.g., ["locality", "political"])
  matched_substrings: Array<{
    length: number; // Length of the matched substring
    offset: number; // Offset of the matched substring
  }>; // Highlighted parts of the query in the description
  terms: Array<{
    offset: number; // Offset of the term in the description
    value: string; // Individual term in the description
  }>; // Terms that make up the description
  distance_meters?: number; // Optional: Distance in meters (if available)
  [key: string]: any; // Allow additional fields for flexibility
};
