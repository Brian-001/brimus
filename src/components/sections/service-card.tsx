"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
  href?: string;
  index: number;
  variant?: "default" | "minimal";
  onReadMore?: () => void;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  details,
  href,
  index,
  variant = "default",
  onReadMore,
}: ServiceCardProps) {
  const minimal = variant === "minimal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div
        className={cn(
          "group relative h-full overflow-hidden border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover",
          minimal ? "flex flex-col rounded-xl p-5 md:p-6" : "rounded-2xl p-6 md:p-8",
          href ? "cursor-pointer" : "",
        )}
      >
        {/* hover glow accent */}
        <div
          className={cn(
            "pointer-events-none absolute -right-10 -top-10 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            minimal ? "h-24 w-24" : "h-28 w-28",
          )}
        />

        <div className={cn("relative", minimal && "flex h-full flex-col")}>
          <div
            className={cn(
              "inline-flex items-center justify-center rounded-xl bg-secondary text-primary shadow-sm ring-1 ring-primary/15 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-light group-hover:text-white group-hover:ring-transparent",
              minimal ? "mb-4 h-10 w-10" : "mb-5 h-12 w-12",
            )}
          >
            <Icon className={minimal ? "h-5 w-5" : "h-6 w-6"} />
          </div>

          <h3
            className={cn(
              "font-semibold text-foreground transition-colors duration-300 group-hover:text-primary",
              minimal ? "mb-2 text-lg" : "mb-3 text-xl",
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground",
              minimal ? "line-clamp-3" : "mb-4",
            )}
          >
            {description}
          </p>

          {!minimal && details && details.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {details.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {minimal && onReadMore && (
            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={onReadMore}
                aria-label={`Read more about ${title}`}
                className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-primary transition-all duration-300 hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group-hover:gap-2.5"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {!minimal && href && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-2.5">
              Learn more <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
