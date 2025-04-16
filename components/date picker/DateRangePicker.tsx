"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export function DatePickerWithRange({
  className,
  onDateSelect,
  initialValue,
}: React.HTMLAttributes<HTMLDivElement> & {
  onDateSelect?: (date: DateRange | undefined) => void;
  initialValue?: DateRange;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialValue ?? undefined
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEndDateSelection, setIsEndDateSelection] = React.useState(false);

  React.useEffect(() => {
    if (initialValue) {
      setDate(initialValue);
    }
  }, [initialValue]);

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }

    // If we have a start date but no end date, we're selecting the end date
    if (newDate?.from && !newDate?.to && !isEndDateSelection) {
      setIsEndDateSelection(true);
      return;
    }

    // If we have both dates or we're in end date selection mode, close the popover
    if ((newDate?.from && newDate?.to) || isEndDateSelection) {
      setIsOpen(false);
      setIsEndDateSelection(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
