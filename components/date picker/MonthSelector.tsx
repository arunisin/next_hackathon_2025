"use client";

import { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup
} from "@/components/ui/command";
import { CalendarIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Optional, for conditional classNames

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

type MonthSelectorProps = {
    selectedMonth: string | null;
    setSelectedMonth: (month: string) => void;
};

export function MonthSelector({
    selectedMonth,
    setSelectedMonth
}: MonthSelectorProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full text-muted-foreground font-light justify-between"
                >
                    {selectedMonth || "Select month"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search month..." />
                    <CommandList>
                        <CommandGroup>
                            {months.map((month) => (
                                <CommandItem
                                    key={month}
                                    onSelect={() => {
                                        setSelectedMonth(month);
                                        setOpen(false);
                                    }}
                                >
                                    {month}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedMonth === month ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
