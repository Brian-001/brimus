"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { iconMap } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Service } from "@/types";

interface ServiceDetailDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailDialog({
  service,
  open,
  onOpenChange,
}: ServiceDetailDialogProps) {
  if (!service) return null;

  const Icon = iconMap[service.icon];
  const hasItems = !!service.items && service.items.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary ring-1 ring-primary/15">
            <Icon className="h-6 w-6" />
          </div>
          <DialogTitle>{service.title}</DialogTitle>
          <DialogDescription>{service.description}</DialogDescription>
        </DialogHeader>

        <div className="-mx-1 flex-1 overflow-y-auto px-1 pb-1 pr-2">
          {service.longDescription && (
            <p className="mb-6 leading-relaxed text-foreground/80">
              {service.longDescription}
            </p>
          )}

          {hasItems && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Key Offerings
              </h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {service.items?.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p className="text-xs text-muted-foreground">
            Tailored to your engagement scope and reporting requirements.
          </p>
          <Link href="/contact" onClick={() => onOpenChange(false)}>
            <Button size="sm" className="rounded-lg">
              Discuss this service <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
