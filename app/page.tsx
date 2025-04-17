import PlaceAutocomplete from "@/components/google autocomplete/PlaceAutocomplete";
import Hero from "@/components/hero";
import TravelPlannerForm from "@/components/test/TravelPlannerForm";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import UserInputs from "@/components/userInputs/UserInputs";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="min-h-[calc(100vw-100px)] flex-1 flex justify-center items-center">
      {/* <Hero /> */}
      <main className="max-w-3xl overflow-hidden flex-1 flex flex-col  gap-6 p-8">
        <h2 className="font-medium text-xl">Where are we going this time?</h2>
        {/* <TravelPlannerForm /> */}
        <Suspense fallback={<div>Loading places...</div>}>
          <UserInputs />
        </Suspense>
        {/* {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}
      </main>
    </div>
  );
}
