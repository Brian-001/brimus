"use client";

import { motion } from "framer-motion";
import {
  Target,
  Lightbulb,
  Heart,
  ShieldCheck,
  Award,
  Handshake,
  ArrowRight,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/sections/stat-section";
import { teamMembers } from "@/lib/data";
import { COMPANY_FOUNDERS as companyFounders } from "@/lib/constants";

const values = [
  {
    icon: Heart,
    title: "Integrity",
    description:
      "We conduct every engagement with the highest ethical standards and transparency.",
  },
  {
    icon: ShieldCheck,
    title: "Excellence",
    description:
      "Quality is non-negotiable. Every deliverable meets ICPAK and international standards.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage technology and creative thinking to solve complex business challenges.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We work as extensions of our clients' teams, aligned with their goals and success.",
  },
  {
    icon: Award,
    title: "Professionalism",
    description:
      "All professionals maintain active memberships with ICPAK and relevant bodies.",
  },
  {
    icon: Target,
    title: "Client Focus",
    description:
      "Every solution is tailored to the unique needs and context of our clients.",
  },
];

const strengths = [
  {
    icon: Award,
    title: "Deep African Experience",
    description:
      "Decades of hands-on consulting across East, Central, and Southern African markets.",
  },
  {
    icon: Rocket,
    title: "Multi-Sector Expertise",
    description:
      "Proven success across NGOs, donors (USAID, UNDP, World Bank), private sector, SACCOs, and government.",
  },
  {
    icon: ShieldCheck,
    title: "ICPAK & ISQC Quality",
    description:
      "All engagements adhere to the highest professional auditing and quality control standards.",
  },
  {
    icon: Handshake,
    title: "Senior Partner Involvement",
    description:
      "Founders and senior partners are directly engaged in every critical engagement.",
  },
  {
    icon: Lightbulb,
    title: "Extensive Resources",
    description:
      "Comprehensive research capabilities, industry data, and professional networks at our disposal.",
  },
  {
    icon: Award,
    title: "Staff Continuity",
    description:
      "Long-tenured professionals ensure consistency and institutional knowledge on every project.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="animate-pulse-soft absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
              <span className="h-px w-6 bg-cyan-300/60" />
              About Us
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
              Built on Trust.{" "}
              <span className="text-gradient">Driven by Expertise.</span>
            </h1>
            <p className="text-lg leading-relaxed text-cyan-50/80">
              Brimus Consultancy Ltd was founded by Onesmus Murimi & Brian
              Kimathi with a vision to become the leading consulting firm and
              the first choice on financial matters in Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Heritage */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Heritage
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Brimus Consultancy Ltd was established in Nairobi, Kenya, by
                  Onesmus Murimi and Brian Kimathi — two seasoned professionals
                  with deep roots in the African consulting landscape.
                </p>
                <p>
                  With over two decades of combined experience in Big 4 firms,
                  international development organisations, and the private
                  sector, our founders recognised the need for a consulting
                  practice that combines world-class professionalism with
                  intimate African market knowledge.
                </p>
                <p>
                  From our Nairobi headquarters, we serve clients across Kenya
                  and the broader East African region, with engagements spanning
                  25+ countries.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-light aspect-[4/3] flex items-center justify-center shadow-card-hover">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white/20 mb-2">
                    B
                  </div>
                  <span className="text-white/70 font-medium">
                    {companyFounders}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding gradient-soft">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-gradient-to-br from-primary to-primary-hover p-8 md:p-10 text-white shadow-card"
            >
              <Target className="h-10 w-10 mb-4 text-cyan-300" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                To be a leading consulting firm and the first choice on
                financial matters in Africa.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-xl bg-gradient-to-br from-accent to-primary p-8 md:p-10 text-white shadow-card"
            >
              <Handshake className="h-10 w-10 mb-4 text-cyan-200" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                To deliver client-based professional services in audit,
                accountancy, financial services, and strategic management with
                integrity and value for money.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Values"
            title="What Drives Us"
            description="Our values shape every interaction and every deliverable."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-5">
                  <val.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {val.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Strengths */}
      <section className="section-padding gradient-soft">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Strengths"
            title="Why Clients Choose Brimus"
            description="Key capabilities that differentiate us in the market."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1 text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Leadership"
            title="Meet Our Founders"
            description="Our leadership brings decades of experience from top-tier firms and international organisations."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="mx-auto mb-5 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-center text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-accent text-center mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button variant="default" className="rounded-lg">
                Connect With Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

