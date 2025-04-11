// app/api/plans/route.ts
import { TravelPlannerService } from '@/lib/ai/services/TravelPlannerService';
import { TravelPreferencesSchema } from '@/lib/ai/types';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const input = await req.json();
        const service = new TravelPlannerService();

        // Validate input against schema
        const preferences = TravelPreferencesSchema.parse(input);

        // Generate plan
        const plan = await service.generatePlan(preferences);

        console.log('plaaa', plan);

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Plan generation failed:', error);
        return NextResponse.json(
            { error: 'Failed to generate travel plan' },
            { status: error instanceof z.ZodError ? 400 : 500 }
        );
    }
}