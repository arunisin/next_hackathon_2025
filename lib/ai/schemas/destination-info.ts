import { z } from "zod";

export const DestinationInfoSchema = z.object({
  destination: z.string(),
  duration: z.object({
    from: z.string(),
    to: z.string(),
  }),
  weather: z.object({
    temperature_range: z.string(),
    description: z.string(),
    source: z.string(),
  }),
  timezone: z.object({
    name: z.string(),
    utc_offset: z.string(),
    source: z.string(),
  }),
  currency: z.object({
    name: z.string(),
    symbol: z.string(),
    code: z.string(),
    source: z.string(),
  }),
  culture: z.object({
    background: z.string(),
    local_customs: z.array(z.string()),
    source: z.string(),
  }),
  food_and_drinks: z.object({
    local_cuisine: z.array(z.string()),
    must_try_drinks: z.array(z.string()),
    source: z.string(),
  }),
  language: z.object({
    primary_language: z.string(),
    essential_phrases: z.array(
      z.object({
        phrase: z.string(),
        translation: z.string(),
      })
    ),
    translator_link_suggestion: z.string(),
  }),
  events_and_festivals: z
    .array(
      z.object({
        name: z.string(),
        dates: z.string(),
        description: z.string(),
        source: z.string(),
      })
    )
    .optional(),
  additional_notes: z.string().optional(),
});
