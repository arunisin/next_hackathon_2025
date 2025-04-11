// components/TravelPlannerForm.tsx
'use client';
import { useState } from 'react';
import { useTravelPlanner } from '@/hooks/useTravelPlanner';
import type { TravelPreferences } from '@/lib/ai/types';

export default function TravelPlannerForm() {
    const { plan, error, isLoading, generatePlan } = useTravelPlanner();
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormErrors({});

        const formData = new FormData(e.currentTarget);
        const preferences: TravelPreferences = {
            destination: formData.get('destination') as string,
            duration: formData.get('duration') as string,
            budget: formData.get('budget') as 'low' | 'medium' | 'high' | 'luxury',
            travelerType: formData.get('travelerType') as 'solo' | 'couple' | 'family' | 'friends' | 'business',
            interests: (formData.getAll('interests') as string[]).filter(Boolean),
            startDate: formData.get('startDate') as string || undefined,
            specialRequirements: (formData.getAll('specialRequirements') as string[]).filter(Boolean),
        };

        try {
            await generatePlan(preferences);
        } catch (err) {
            if (err instanceof Error) {
                setFormErrors({ form: err.message });
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                        Destination
                    </label>
                    <input
                        type="text"
                        id="destination"
                        name="destination"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                    {formErrors.destination && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.destination}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Trip Duration
                    </label>
                    <select
                        id="duration"
                        name="duration"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    >
                        <option value="">Select duration</option>
                        <option value="3 days">3 days</option>
                        <option value="1 week">1 week</option>
                        <option value="2 weeks">2 weeks</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <div className="mt-1 space-x-4">
                        {['low', 'medium', 'high', 'luxury'].map((option) => (
                            <label key={option} className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="budget"
                                    value={option}
                                    required
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 capitalize">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Traveler Type</label>
                    <select
                        name="travelerType"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    >
                        <option value="">Select traveler type</option>
                        <option value="solo">Solo</option>
                        <option value="couple">Couple</option>
                        <option value="family">Family</option>
                        <option value="friends">Friends</option>
                        <option value="business">Business</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Interests</label>
                    <div className="mt-2 space-y-2">
                        {['Beach', 'Museums', 'Hiking', 'Food', 'Shopping'].map((interest) => (
                            <label key={interest} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="interests"
                                    value={interest.toLowerCase()}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">{interest}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date (Optional)
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Special Requirements (Optional)
                    </label>
                    <textarea
                        name="specialRequirements"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="Accessibility needs, dietary restrictions, etc."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isLoading ? 'Planning Your Trip...' : 'Generate Travel Plan'}
                </button>

                {formErrors.form && (
                    <div className="p-4 text-red-600 bg-red-50 rounded-md">
                        {formErrors.form}
                    </div>
                )}
            </form>

            {isLoading && (
                <div className="mt-8 p-4 bg-blue-50 rounded-md text-center">
                    <p>Creating your personalized itinerary...</p>
                    <div className="mt-2 h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                        <div className="animate-pulse h-full bg-blue-400 w-1/2"></div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-md">
                    <p>Error: {error}</p>
                </div>
            )}

            {plan && (
                <div className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">Your Travel Plan</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold">{plan.title}</h3>
                            <p className="text-gray-600">{plan.summary}</p>
                        </div>
                        {/* Add more plan rendering as needed */}
                    </div>
                </div>
            )}
        </div>
    );
}