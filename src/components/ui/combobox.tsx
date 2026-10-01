"use client";

import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  error,
  disabled = false,
  id,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const active = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  };

  const remove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(active + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(active - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[active];
      if (option) toggle(option.value);
    }
  };

  const selectedLabels = value.map(
    (v) => options.find((o) => o.value === v)?.label ?? v,
  );

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listId}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onClickCapture={(e) => {
              if (disabled) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
            className={cn(
              "flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              error && "border-destructive",
              disabled &&
                "pointer-events-none cursor-not-allowed opacity-50",
            )}
          >
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              {selectedLabels.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedLabels.map((l) => {
                  const optionValue =
                    options.find((o) => o.label === l)?.value ?? l;
                  return (
                    <span
                      key={optionValue}
                      className="inline-flex max-w-full items-center gap-1 rounded-md bg-cyan-500/15 px-2 py-0.5 text-xs font-medium text-cyan-700 ring-1 ring-inset ring-cyan-500/30 dark:text-cyan-300"
                    >
                      <span className="truncate">{l}</span>
                      {!disabled && (
                        <button
                          type="button"
                          aria-label={`Remove ${l}`}
                          onClick={(e) => remove(optionValue, e)}
                          className="rounded-full p-0.5 hover:bg-cyan-500/25"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  );
                })
              )}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            searchRef.current?.focus();
          }}
          className={cn(
            "z-50 w-[var(--radix-popover-trigger-width)] min-w-56 overflow-hidden rounded-lg border border-border bg-popover p-0 shadow-lg",
            className,
          )}
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search services..."
              className="h-7 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <ul
            id={listId}
            role="listbox"
            aria-multiselectable
            className="max-h-60 overflow-auto p-1"
          >
            {filtered.map((option, i) => {
              const selected = value.includes(option.value);
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => toggle(option.value)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm",
                    i === active && "bg-secondary",
                    selected
                      ? "font-medium text-primary"
                      : "text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input",
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  <span className="truncate">{option.label}</span>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                No services found.
              </li>
            )}
          </ul>

          {value.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
              <span>{value.length} selected</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="font-medium text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
