"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionSectionProps {
  items: FAQItem[];
  type?: "single" | "multiple";
  className?: string;
}

export function AccordionSection({
  items,
  type = "single",
  className,
}: AccordionSectionProps) {
  return (
    <Accordion
      type={type}
      collapsible
      className={cn("w-full", className)}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-border data-[state=open]:bg-secondary/20 rounded-lg transition-colors"
        >
          <AccordionTrigger className="flex w-full items-center justify-between py-4 font-medium transition-all hover:text-primary text-left">
            {item.question}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ui-state-open:rotate-180" />
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
