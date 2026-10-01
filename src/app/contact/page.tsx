"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Navigation } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SectionHeader } from "@/components/sections/stat-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { BackButton } from "@/components/ui/back-button";
import { Combobox } from "@/components/ui/combobox";
import { Toast } from "@/components/sections/toast";
import { services } from "@/lib/data";
import { GOOGLE_MAPS_EMBED_URL, GOOGLE_MAPS_URL } from "@/lib/constants";

// Zod schema for validation
const inquirySchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must not exceed 100 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters" })
    .max(20, { message: "Phone number must not exceed 20 characters" }),
  company: z.string().max(200, { message: "Company name must not exceed 200 characters" }).optional().or(z.literal("")),
  services: z
    .array(z.string())
    .min(1, { message: "Please select at least one service of interest" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must not exceed 2000 characters" }),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { services: [] },
    mode: "onChange",
  });

  const selectedServices = useWatch({ control, name: "services" }) ?? [];

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setToast({ message: "Inquiry submitted successfully! We'll be in touch shortly.", type: "success" });
        reset();
      } else {
        setToast({ message: result.message || "Something went wrong. Please try again.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error. Please check your connection and try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="animate-pulse-soft absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
          <BackButton className="mb-6" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
              <span className="h-px w-6 bg-cyan-300/60" />
              Contact Us
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
              Let&apos;s Start the{" "}
              <span className="text-gradient">Conversation</span>
            </h1>
            <p className="text-lg leading-relaxed text-cyan-50/80">
              Ready to discuss your business needs? Send us an inquiry
              and we&apos;ll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                align="left"
                title="Get In Touch"
                description="We'd love to hear from you. Here's how to reach us."
              />

              <div className="space-y-5">
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Office Address</h4>
                    <p className="text-sm text-muted-foreground">{`Mang'u Road, Thika, Kenya`}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Phone</h4>
                    <a href="tel:+254722366503" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      +254 722 366 503 || +254 705 213 352
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Email</h4>
                    <a href="mailto:info@brimus.co.ke" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      info@brimus.co.ke
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Mon – Fri, 8:00 AM – 5:00 PM EAT</p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="mt-6 overflow-hidden rounded-xl border border-border shadow-card">
                <div className="relative aspect-video w-full">
                  <iframe
                    title="Brimus Consultancy Ltd on Google Maps"
                    src={GOOGLE_MAPS_EMBED_URL}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg ring-1 ring-border backdrop-blur transition-colors hover:bg-secondary"
                  >
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                    Get directions
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Inquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
                <h2 className="mb-2 text-2xl font-bold text-foreground">Send an Inquiry</h2>
                <p className="mb-8 text-sm text-muted-foreground">
                  Fill in the form below and we&apos;ll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <Input
                    label="Full Name"
                    placeholder="Your full name"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>

                  <Input
                    label="Company / Organization"
                    placeholder="Your company name (optional)"
                    {...register("company")}
                    error={errors.company?.message}
                  />

                  <Combobox
                    label="Service of Interest"
                    placeholder="Select one or more services"
                    options={services.map((s) => ({
                      value: s.title,
                      label: s.title,
                    }))}
                    value={selectedServices}
                    onChange={(v) =>
                      setValue("services", v, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    error={errors.services?.message}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us about your project or requirements..."
                    rows={5}
                    {...register("message")}
                    error={errors.message?.message}
                  />

                  <SubmitButton loading={isSubmitting} loadingText="Sending Inquiry..." className="w-full">
                    Send Inquiry <Send className="ml-2 h-4 w-4" />
                  </SubmitButton>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
