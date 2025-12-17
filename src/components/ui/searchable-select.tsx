import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableSelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
  showClearButton?: boolean;
  handleClear?: (e: React.MouseEvent) => void;
}

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  className,
  searchPlaceholder = "Search...",
  showClearButton = false,
  handleClear,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Safely find selected option
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background border-input hover:bg-accent hover:text-accent-foreground text-left font-normal relative",
            !selectedOption && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate pr-8">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1 absolute right-2">
            {showClearButton && selectedOption && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-accent hover:text-accent-foreground"
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border shadow-lg z-[100]"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command className="bg-background" shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 border-none bg-background"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
              No option found.
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto py-2">
              {options
                .filter((option) =>
                  option.label?.toLowerCase().includes(searchValue?.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
