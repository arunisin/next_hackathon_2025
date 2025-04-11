// lib/ai/core/AIService.ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export class AIService {
    protected async generateStructuredOutput<T extends z.ZodTypeAny>(
        schema: T,
        options: {
            modelId: string;
            systemPrompt: string;
            userPrompt: string;
            schemaName: string;
            schemaDescription: string;
        }
    ): Promise<z.infer<T>> {
        const result = await generateObject({
            model: openai(options.modelId, { structuredOutputs: true }),
            schemaName: options.schemaName,
            schemaDescription: options.schemaDescription,
            schema,
            messages: [
                { role: 'system', content: options.systemPrompt },
                { role: 'user', content: options.userPrompt },
            ],
        });

        return result.object;
    }
}