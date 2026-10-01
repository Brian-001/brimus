"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={cn(
              "peer sr-only",
              className,
            )}
            {...props}
          />
          <div className="h-4 w-4 rounded border border-border bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors">
            <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity m-auto mt-0.5" />
          </div>
        </div>
        {label && (
          <Label className="text-sm font-medium cursor-pointer text-foreground">
            {label}
          </Label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
