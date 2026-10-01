"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/sections/stat-section";
import { ServiceCard } from "@/components/sections/service-card";
import { ServiceDetailDialog } from "@/components/sections/service-detail-dialog";
import { services, iconMap } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "all", label: "All Services" },
  { id: "assurance", label: "Assurance" },
  { id: "tax", label: "Tax" },
  { id: "advisory", label: "Advisory" },
  { id: "outsourcing", label: "Outsourcing & PM" },
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const filtered =
    activeTab === "all"
      ? services
      : services.filter((s) => s.id === activeTab);

  const activeService =
    services.find((s) => s.id === activeServiceId) ?? null;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="animate-pulse-soft absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-32 sm:px-6 md:pb-16 md:pt-44 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
              <span className="h-px w-6 bg-cyan-300/60" />
              Services
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
              Comprehensive{" "}
              <span className="text-gradient">Consulting Solutions</span>
            </h1>
            <p className="text-lg leading-relaxed text-cyan-50/80">
              From audit and tax to strategic advisory and project management —
              we deliver end-to-end professional services across Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Service Categories"
            title="What We Offer"
            description="Four core service lines designed to meet your every need. Open any service for the full scope of offerings."
          />

          {/* Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/25"
                    : "bg-secondary text-muted-foreground ring-1 ring-border hover:bg-secondary/80",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((service, i) => (
              <ServiceCard
                key={service.id}
                icon={iconMap[service.icon]}
                title={service.title}
                description={service.description}
                index={i}
                variant="minimal"
                onReadMore={() => setActiveServiceId(service.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-soft">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Not Sure What You Need?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Contact us and we&apos;ll help identify the right services for your
            specific requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="default" className="rounded-lg">
              Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Single-service detail (Read More) */}
      <ServiceDetailDialog
        service={activeService}
        open={!!activeService}
        onOpenChange={(open) => {
          if (!open) setActiveServiceId(null);
        }}
      />
    </main>
  );
}
