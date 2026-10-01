"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  index: number;
  inverse?: boolean;
}

export function StatCard({ value, label, index, inverse }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div
        className={cn(
          "mb-1 text-4xl font-extrabold tracking-tight md:text-5xl",
          inverse
            ? "bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent"
            : "text-gradient",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "text-sm font-medium",
          inverse ? "text-cyan-100" : "text-muted-foreground",
        )}
      >
        {label}
      </div>
    </motion.div>
  );
}

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {label && (
        <span
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide",
            dark ? "text-cyan-300" : "text-cyan-600",
          )}
        >
          <span
            className={cn(
              "h-px w-6",
              dark ? "bg-cyan-300/60" : "bg-cyan-600/60",
            )}
          />
          {label}
          <span
            className={cn(
              "h-px w-6",
              align === "center"
                ? dark
                  ? "bg-cyan-300/60"
                  : "bg-cyan-600/60"
                : "hidden",
            )}
          />
        </span>
      )}
      <h2
        className={cn(
          "mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto max-w-2xl text-lg leading-relaxed",
            dark ? "text-cyan-100/80" : "text-muted-foreground",
            align === "left" && "mx-0",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}