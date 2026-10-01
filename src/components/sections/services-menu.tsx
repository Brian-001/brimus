"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowRight, ChevronDown } from "lucide-react";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ServicesMenuProps {
  active: boolean;
}

export function ServicesMenu({ active }: ServicesMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Services"
          className={cn(
            "group inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active
              ? "bg-white/15 text-white shadow-inner"
              : "text-cyan-50/85 hover:bg-white/10 hover:text-white",
          )}
        >
          Services
          <ChevronDown
            className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="center"
          sideOffset={14}
          className="z-[60] w-[min(calc(100vw-2rem),680px)] rounded-2xl border border-border bg-card p-3 shadow-card"
        >
          <div className="grid gap-1 sm:grid-cols-2">
            {services.map((service) => (
              <DropdownMenu.Item key={service.id} asChild>
                <Link
                  href={`/services#${service.id}`}
                  className="group/item block rounded-xl p-3 outline-none transition-colors hover:bg-secondary focus:bg-secondary"
                >
                  <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-foreground">
                    {service.title}
                    <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover/item:opacity-100" />
                  </span>
                  <ul className="space-y-0.5">
                    {service.items?.map((item) => (
                      <li
                        key={item}
                        className="text-xs leading-relaxed text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Link>
              </DropdownMenu.Item>
            ))}
          </div>
          <DropdownMenu.Separator className="my-2 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Link
              href="/services"
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-primary outline-none transition-colors hover:bg-secondary focus:bg-secondary"
            >
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
