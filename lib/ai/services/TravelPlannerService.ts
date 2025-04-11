// lib/ai/services/TravelPlannerService.ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { TravelPreferences } from '../types';
import { TravelPlanSchema } from '../schemas';

export class TravelPlannerService {
    private modelId = 'gpt-4o'; // Verified supported model
    private systemPrompt = `
    You are an expert travel planner. Follow these rules:
    1. Always return COMPLETE JSON with ALL requested fields
    2. Provide 3-5 items for each array
    3. Never omit any fields
    4. Use exact field names from the schema
  `;

    async generatePlan(preferences: TravelPreferences) {
        const { object: plan } = await generateObject({
            model: openai(this.modelId, { structuredOutputs: true }),
            schema: TravelPlanSchema,
            messages: [
                {
                    role: 'system',
                    content: this.systemPrompt
                },
                {
                    role: 'user',
                    content: this.buildPrompt(preferences)
                }
            ],
            temperature: 0.5 // Balanced creativity
        });

        return this.validatePlan(plan);
    }

    private buildPrompt(input: TravelPreferences): string {
        return `
      Create ${input.duration} trip to ${input.destination} for ${input.travelerType}.
      Budget: ${input.budget}
      Interests: ${input.interests.join(', ')}

      MUST INCLUDE:
      - Daily morning/afternoon/evening activities
      - Dining recommendations with details
      - Themed days
      - Packing list categories
      - Cost estimates
    `;
    }

    private validatePlan(plan: unknown) {
        const result = TravelPlanSchema.safeParse(plan);

        if (!result.success) {
            console.error('Validation failed:', result.error.format());
            throw new Error('AI returned incomplete data');
        }

        return result.data;
    }
}