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
    seasonal_info: z.array(
      z.object({
        season: z.string(),
        description: z.string(),
        temperature: z.string(),
        precipitation: z.string(),
      })
    ),
    source: z.string(),
  }),
  transportation: z.object({
    public_transport: z.array(
      z.object({
        type: z.string(),
        description: z.string(),
        cost_range: z.string(),
      })
    ),
    getting_from_airport: z.array(z.string()),
    local_tips: z.array(z.string()),
    source: z.string(),
  }),
  districts: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      known_for: z.array(z.string()),
      highlights: z.array(z.string()),
    })
  ),
  culture: z.object({
    background: z.string(),
    local_customs: z.array(z.string()),
    etiquette_tips: z.array(z.string()),
    traditional_arts: z.array(z.string()),
    source: z.string(),
  }),
  food_and_drinks: z.object({
    local_cuisine: z.array(z.string()),
    must_try_dishes: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        where_to_try: z.string(),
        price_range: z.string(),
      })
    ),
    must_try_drinks: z.array(z.string()),
    dining_etiquette: z.array(z.string()),
    source: z.string(),
  }),
  shopping: z.object({
    markets: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        specialties: z.array(z.string()),
        location: z.string(),
        best_times: z.string(),
      })
    ),
    souvenirs: z.array(z.string()),
    shopping_areas: z.array(z.string()),
    source: z.string(),
  }),
  accommodation: z.object({
    areas: z.array(
      z.object({
        name: z.string(),
        suitable_for: z.array(z.string()),
        price_range: z.string(),
        description: z.string(),
      })
    ),
    tips: z.array(z.string()),
    source: z.string(),
  }),
  practical_info: z.object({
    visa_requirements: z.string(),
    health_safety: z.array(z.string()),
    emergency_contacts: z.array(
      z.object({
        service: z.string(),
        number: z.string(),
      })
    ),
    best_time_to_visit: z.object({
      general: z.string(),
      peak_season: z.string(),
      off_season: z.string(),
      shoulder_season: z.string(),
    }),
    source: z.string(),
  }),
  attractions: z.object({
    historical: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        visiting_hours: z.string(),
        ticket_price: z.string(),
        tips: z.array(z.string()),
      })
    ),
    natural: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        best_time: z.string(),
        access_info: z.string(),
        activities: z.array(z.string()),
      })
    ),
    source: z.string(),
  }),
  events_and_festivals: z.array(
    z.object({
      name: z.string(),
      dates: z.string(),
      description: z.string(),
      location: z.string(),
      highlights: z.array(z.string()),
      source: z.string(),
    })
  ),
  cost_of_living: z.object({
    budget_per_day: z.object({
      budget: z.string(),
      mid_range: z.string(),
      luxury: z.string(),
    }),
    common_expenses: z.array(
      z.object({
        item: z.string(),
        cost_range: z.string(),
      })
    ),
    source: z.string(),
  }),
  language: z.object({
    primary_language: z.string(),
    essential_phrases: z
      .array(
        z.object({
          phrase: z.string(),
          translation: z.string(),
        })
      )
      .optional(),
  }),
});
