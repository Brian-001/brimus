"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SheetContextValue {
  onClose: () => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext() {
  return React.useContext(SheetContext);
}

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  /** Accessible name for the dialog panel. */
  label?: string;
}

export function Sheet({ open = false, onOpenChange, children, className, label }: SheetProps) {
  const onClose = React.useCallback(() => onOpenChange?.(false), [onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <SheetContext.Provider value={{ onClose }}>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label ?? "Site navigation"}
        className={cn("fixed z-50 bg-background shadow-lg transition-all", className)}
      >
        {children}
      </div>
    </SheetContext.Provider>
  );
}

type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  );
}

type SheetCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SheetClose({ className, onClick, ...props }: SheetCloseProps) {
  const context = useSheetContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context?.onClose();
      }}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}
