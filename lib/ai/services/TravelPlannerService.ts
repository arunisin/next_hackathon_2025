// lib/ai/services/TravelPlannerService.ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { TravelPreferences, TravelPreferencesSchema } from '../types';
import { TravelPlanSchema } from '../schemas';

export class TravelPlannerService {
    private modelId = 'gpt-4o-2024-08-06';
    private systemPrompt = `
    You are an expert travel planner with 20 years of experience creating perfect 
    itineraries. Follow these rules:
    - Always consider the traveler type and budget
    - Include unique local experiences
    - Balance activity intensity
    - Provide dining options matching preferences
  `;

    async generatePlan(preferences: TravelPreferences) {
        // Validate input first
        const validatedInput = TravelPreferencesSchema.parse(preferences);

        return generateObject({
            model: openai(this.modelId, { structuredOutputs: true }),
            schema: TravelPlanSchema,
            schemaName: 'travelPlan',
            schemaDescription: 'Complete travel itinerary with daily plans and recommendations',
            messages: [
                {
                    role: 'system',
                    content: this.systemPrompt
                },
                {
                    role: 'user',
                    content: this.buildPrompt(validatedInput)
                }
            ],
            temperature: 0.3 // More deterministic for planning
        });
    }

    private buildPrompt(input: TravelPreferences): string {
        return `
      Create a ${input.duration} trip plan for ${input.travelerType} traveling to ${input.destination}.
      Budget: ${input.budget}
      Key interests: ${input.interests.join(', ')}
      ${input.startDate ? `Travel dates: ${input.startDate}` : ''}
      ${input.specialRequirements ? `Special needs: ${input.specialRequirements.join(', ')}` : ''}
      
      Include:
      1. Daily itinerary with time blocks
      2. Restaurant recommendations
      3. Packing list by category
      4. Cost estimates
    `;
    }
}