"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Building2,
  Globe,
  Award,
  ShieldCheck,
  HeartHandshake,
  Landmark,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, StatCard } from "@/components/sections/stat-section";
import { ServiceCard } from "@/components/sections/service-card";
import { services, iconMap } from "@/lib/data";
import { teamMembers } from "@/lib/data";
import { experiences } from "@/lib/data";

const stats = [
  { value: "20+", label: "Years of Experience" },
  { value: "150+", label: "Projects Delivered" },
  { value: "50+", label: "Clients Served" },
  { value: "25+", label: "Countries Reached" },
];

const whoWeServe = [
  {
    icon: HeartHandshake,
    title: "NGOs & Development Organisations",
    description:
      "Financial management, donor compliance, monitoring & evaluation and programme advisory.",
  },
  {
    icon: Building2,
    title: "Private Sector",
    description:
      "Audit, tax, due diligence, strategy and financial advisory for growing businesses.",
  },
  {
    icon: Landmark,
    title: "Government & Public Institutions",
    description:
      "Public financial management, policy analysis and institutional advisory.",
  },
  {
    icon: PiggyBank,
    title: "SACCOs & Financial Institutions",
    description:
      "Audit, risk, governance and IT assurance for member-based institutions.",
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "ICPAK & ISQC Compliant",
    description:
      "All audit and assurance services meet the highest professional standards set by ICPAK and ISQC.",
    tag: "Quality First",
  },
  {
    icon: Globe,
    title: "Pan-African Reach",
    description:
      "Deep experience across East, Central, and Southern Africa with multi-jurisdictional expertise.",
    tag: "25+ Countries",
  },
  {
    icon: Award,
    title: "Senior Partner Involvement",
    description:
      "Every engagement benefits from direct involvement of senior partners with decades of experience.",
    tag: "Direct Access",
  },
  {
    icon: TrendingUp,
    title: "Multi-Sector Expertise",
    description:
      "Proven track record across NGOs, donors, private sector, SACCOs, and government agencies.",
    tag: "All Sectors",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="animate-pulse-soft absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute right-10 top-16 h-40 w-40 rounded-full bg-cyan-200/15 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
              Brimus Consultancy
            </h1>
            <p className="mb-4 max-w-2xl text-xl font-semibold text-cyan-100 md:text-2xl">
              Professional expertise for complex business decisions.
            </p>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-cyan-50/80 md:text-xl">
              Audit, tax, advisory, research and strategic management services
              for businesses, NGOs, development organisations and public
              institutions across Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="xl" variant="light" className="rounded-full">
                  Talk to an Advisor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="xl"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/15 hover:text-white"
                >
                  Our Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-2 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-2 gap-8 border-t border-white/25 pt-8 md:grid-cols-4 md:divide-x md:divide-white/20"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} inverse />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Who We Serve"
            title="Who We Work With"
            description="We support organisations that answer to donors, boards, regulators and members — with the rigour those audiences demand."
          />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {whoWeServe.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group bg-card p-6 transition-colors duration-300 hover:bg-secondary/60 md:p-7"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary ring-1 ring-primary/15 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground md:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="What We Do"
            title="Comprehensive Professional Services"
            description="We deliver tailored solutions across four core service lines, combining deep expertise with a client-first approach."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                icon={iconMap[service.icon]}
                title={service.title}
                description={service.description}
                details={service.items?.slice(0, 4)}
                index={i}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Services <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Brimus Section */}
      <section className="section-padding gradient-soft">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Why Brimus"
            title="Our Promise to Every Client"
            description="We combine the rigour of Big 4 standards with the personal attention of a boutique firm."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover md:p-8"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary ring-1 ring-primary/15 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="mb-2 inline-block rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-700 ring-1 ring-cyan-200/70">
                  {item.tag}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Experience"
            title="Trusted by Leading Organizations"
            description="From international donors to private corporations, our work speaks across sectors."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-l-4 border-l-primary border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-600">
                  <Building2 className="h-3.5 w-3.5" />
                  {exp.sector}
                </span>
                <h3 className="mb-3 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {exp.client}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Teaser */}
      <section className="section-padding gradient-soft">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Team"
            title="Leadership &amp; Expertise"
            description="Founded by seasoned professionals with decades of combined experience across the continent."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover"
              >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-2xl font-bold text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="mb-3 text-sm font-medium text-cyan-600">
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
                {member.slug && (
                  <Link
                    href={`/about/${member.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all hover:gap-2.5"
                  >
                    View profile <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/experience">
              <Button variant="outline" size="lg" className="rounded-full">
                Meet the Team <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA / Inquiry Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        <div className="animate-pulse-soft absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-cyan-50/80">
              Let&apos;s discuss how Brimus can help you achieve your goals. Reach
              out for a complimentary consultation.
            </p>
            <Link href="/contact" className="inline-block">
              <Button size="xl" variant="light" className="rounded-full">
                Get Started Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}