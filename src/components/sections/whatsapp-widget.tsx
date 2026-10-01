import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/icons";

const HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/**
 * Floating WhatsApp CTA, rendered once in the root layout so it is visible on
 * every public page. Opens wa.me in a new tab with a pre-filled message.
 */
export function WhatsAppWidget() {
  return (
    <div className="wa-float fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <a
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Brimus Consultancy on WhatsApp"
        title="Chat on WhatsApp"
        className={cn(
          "group flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 text-white",
          "shadow-lg shadow-black/25 transition-all duration-300",
          "hover:-translate-y-0.5 hover:bg-[#1EBE5B] hover:shadow-xl hover:shadow-black/30",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
          "sm:h-13 sm:gap-2.5 sm:px-5",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
          <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        </span>
        <span className="hidden text-sm font-semibold tracking-tight sm:inline">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
