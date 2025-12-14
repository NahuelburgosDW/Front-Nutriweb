import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { normalizeText } from "@/lib/normalize-text";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface Opcion {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  options: any[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  emptyText?: string;
}

const Select: React.FC<SelectWithSearchProps> = ({
  options,
  onChange,
  value,
  placeholder = "Selecciona o busca...",
  emptyText = "No se encontraron resultados.",
}) => {
  const [open, setOpen] = React.useState(false);

  // Busca el 'label' que corresponde al 'value' actual
  const currentLabel = options.find((option) => option.id === value)?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {currentLabel ? currentLabel : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />

          <CommandEmpty>{emptyText}</CommandEmpty>

          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={normalizeText(option.name)}
                  onSelect={() => {
                    const newValue = option.id === value ? "" : option.id;
                    onChange(newValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Select;
