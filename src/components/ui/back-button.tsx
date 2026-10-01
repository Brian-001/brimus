import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackButton({
  href = "/",
  className,
  label = "Back",
}: {
  href?: string;
  className?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={href === "/" ? "Back to home" : `Back to ${label}`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2",
        "text-sm font-semibold text-white backdrop-blur-sm",
        "transition-all duration-200 hover:border-white/40 hover:bg-white/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
