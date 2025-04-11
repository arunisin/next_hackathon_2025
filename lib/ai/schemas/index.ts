// lib/ai/schemas.ts
import { z } from 'zod';

export const DiningRecommendationSchema = z.object({
    name: z.string(),
    cuisine: z.string(),
    budgetLevel: z.enum(['$', '$$', '$$$']),
    reservationRecommended: z.boolean(),
});

export const DayItinerarySchema = z.object({
    day: z.number().int().positive(),
    theme: z.string(),
    morning: z.array(z.string()),
    afternoon: z.array(z.string()),
    evening: z.array(z.string()),
    dining: DiningRecommendationSchema,
});

export const PackingCategorySchema = z.object({
    category: z.string(),
    items: z.array(z.string()),
    essential: z.boolean(),
});
// lib/ai/schemas.ts
export const TravelPlanSchema = z.object({
    title: z.string(),
    summary: z.string(),
    itinerary: z.array(
        z.object({
            day: z.number() // Remove all validators temporarily
        })
    )
});