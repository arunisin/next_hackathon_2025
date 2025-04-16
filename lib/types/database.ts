import { z } from "zod";
import { DestinationInfoSchema } from "../ai/schemas/destination-info";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TravelPlannerData = {
  id: string;
  user_id: string | null;
  created_at: string;
  data: string; // JSON string of DestinationInfo
};

// Type for parsed data
export type DestinationInfo = z.infer<typeof DestinationInfoSchema>;

// Helper type for the full travel planner data with parsed JSON
export type TravelPlannerDataWithParsedInfo = Omit<
  TravelPlannerData,
  "data"
> & {
  data: DestinationInfo;
};
