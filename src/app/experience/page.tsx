"use client";

import { motion } from "framer-motion";
import { Award, Building2, Globe, Briefcase, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { SectionHeader } from "@/components/sections/stat-section";
import { teamMembers, experiences } from "@/lib/data";

export default function ExperiencePage() {
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
              Experience & Team
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
              Decades of Experience.{" "}
              <span className="text-gradient">A Team You Can Trust.</span>
            </h1>
            <p className="text-lg leading-relaxed text-cyan-50/80">
              Proven track record with Africa&apos;s most demanding organisations —
              from international donors to private sector leaders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Narrative */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Journey"
            title="Experience That Speaks"
            description="A snapshot of the engagements and clients we've proudly served."
          />

          {/* Narrative blocks */}
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Working With the World&apos;s Leading Organisations
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our team has extensive experience managing complex engagements
                funded by major international donors including USAID, UNDP,
                and the World Bank. We understand donor compliance requirements,
                reporting standards, and the unique challenges of development
                sector auditing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In the private sector, we partner with leading Kenyan corporations
                across manufacturing, real estate, financial services, and technology,
                providing statutory audit, tax advisory, and strategic consulting
                services that drive measurable value.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/90 to-primary-light flex items-center justify-center"
            >
              <div className="p-10 text-center">
                <Building2 className="h-20 w-20 text-white/20 mx-auto mb-4" />
                <p className="text-3xl font-bold text-white/80 mb-2">150+</p>
                <p className="text-white/50">Projects Delivered Across Africa</p>
              </div>
            </motion.div>
          </div>

          {/* Experience cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold tracking-wide uppercase text-accent">
                    {exp.sector}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {exp.client}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding gradient-soft">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Leadership"
            title="Experts Behind Every Engagement"
            description="Our partners and senior professionals bring deep credentials and decades of practical experience."
          />

          {/* Team members */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="text-4xl font-bold text-primary group-hover:text-white transition-colors duration-300">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-accent mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border bg-card p-8 md:p-12 shadow-card"
          >
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
              Professional Credentials & Memberships
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Award, title: "ICPAK Members", desc: "All audit professionals hold active ICPAK certifications" },
                { icon: Briefcase, title: "ISQC Compliance", desc: "Quality control systems meet international standards" },
                { icon: Star, title: "Big 4 Heritage", desc: "Team members trained in Big 4 firms globally" },
                { icon: Globe, title: "Cross-Border Expertise", desc: "Qualified to handle multi-country engagements" },
              ].map((cred, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-lg bg-secondary/50"
                >
                  <cred.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">
                    {cred.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{cred.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button variant="default" className="rounded-lg">
                Work With Our Team <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
