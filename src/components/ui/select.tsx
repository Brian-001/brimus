"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { type SelectProps } from "@radix-ui/react-select";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

interface CustomSelectProps extends SelectProps {
  label?: string;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  error,
  className,
  ...props
}: CustomSelectProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-foreground">
          {label}
        </label>
      )}
      <Select {...props}>
        <SelectTrigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
          )}
        >
          <SelectValue placeholder="Select an option" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border border-border bg-background shadow-lg">
          {props.children}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
