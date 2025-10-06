"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  allowCustom?: boolean
  onCreateNew?: (value: string) => void
  className?: string
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  allowCustom = false,
  onCreateNew,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  )

  const showCreateOption = allowCustom && searchValue && !filteredOptions.includes(searchValue)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showCreateOption) {
      e.preventDefault()
      onCreateNew?.(searchValue)
      onValueChange?.(searchValue)
      setOpen(false)
      setSearchValue("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={handleKeyDown}
          />
          <CommandEmpty className="p-0">
            {showCreateOption ? (
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onCreateNew?.(searchValue)
                    onValueChange?.(searchValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  Create "{searchValue}"
                </Button>
              </div>
            ) : (
              emptyText
            )}
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}