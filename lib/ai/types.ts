// lib/ai/types.ts
import { z } from 'zod';

export type TravelPreferences = z.infer<typeof TravelPreferencesSchema>;
export const TravelPreferencesSchema = z.object({
    destination: z.string().min(2),
    duration: z.string().min(1),
    interests: z.array(z.string().min(1)).min(1),
    budget: z.enum(['low', 'medium', 'high', 'luxury']),
    travelerType: z.enum(['solo', 'couple', 'family', 'friends', 'business']),
    startDate: z.string().optional(), // ISO date string
    specialRequirements: z.array(z.string()).optional(),
});

// Re-export all schemas for easy access
export * from './schemas';