import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="gradient-hero relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-32 text-center">
      <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      <div className="animate-pulse-soft absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="animate-float-slow absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative">
        <span
          aria-hidden="true"
          className="block text-8xl font-extrabold tracking-tight text-white/15 md:text-9xl"
        >
          404
        </span>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mb-10 mt-4 max-w-xl text-lg leading-relaxed text-cyan-50/80">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button size="xl" variant="light" className="rounded-full">
              <Compass className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="xl"
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/15 hover:text-white"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
