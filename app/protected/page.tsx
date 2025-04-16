import PlaceAutocomplete from "@/components/google autocomplete/PlaceAutocomplete";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import QueryClientWrapper from "../../contexts/QueryClinet";
import { DatePickerWithRange } from "@/components/date picker/DateRangePicker";
import UserInputs from "../../components/userInputs/UserInputs";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-12">
        <UserInputs />
      </div>
    </>
  );
}
