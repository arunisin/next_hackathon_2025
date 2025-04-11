// hooks/useTravelPlanner.ts
import { TravelPlanSchema, TravelPreferences } from '@/lib/ai/types';
import { useState } from 'react';
import { z } from 'zod';

export function useTravelPlanner() {
    const [state, setState] = useState<{
        plan: z.infer<typeof TravelPlanSchema> | null;
        error: string | null;
        isLoading: boolean;
    }>({
        plan: null,
        error: null,
        isLoading: false,
    });

    const generatePlan = async (preferences: TravelPreferences) => {
        setState({ plan: null, error: null, isLoading: true });

        try {
            const res = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            const plan = TravelPlanSchema.parse(data);

            setState({ plan, error: null, isLoading: false });
            return plan;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Generation failed';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
            throw error;
        }
    };

    return {
        plan: state.plan,
        error: state.error,
        isLoading: state.isLoading,
        generatePlan
    };
}