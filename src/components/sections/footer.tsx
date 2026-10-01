"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import {
  NAV_LINKS,
  CONTACT_EMAIL,
  SITE_NAME,
  COMPANY_LOCATION,
  CONTACT_PHONE_1,
  CONTACT_PHONE_2,
  WHATSAPP_NUMBER,
  LINKEDIN_URL,
  PIGIECORE_URL,
} from "@/lib/constants";
import { Logo } from "@/components/ui/logo";
import { LinkedInIcon, WhatsAppIcon } from "@/components/ui/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-hero text-white">
      <div className="bg-grid-cyan">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-5 flex items-center gap-3">
                <Logo className="logo-monochrome shrink-0" />
                <span className="text-lg font-bold tracking-tight">
                  Brimus
                </span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-cyan-100/80">
                Leading consulting firm in Africa, delivering professional
                services in audit, accountancy, financial consultancy, tax,
                research, and strategic management.
              </p>
              <div className="flex gap-3">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Brimus Consultancy on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all hover:bg-white/25 hover:-translate-y-0.5"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Brimus Consultancy on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all hover:bg-white/25 hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-cyan-200">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-cyan-50/80 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-cyan-200">
                Services
              </h4>
              <ul className="space-y-3">
                {[
                  "Assurance",
                  "Tax Services",
                  "Advisory",
                  "Outsourcing & PM",
                ].map((s) => (
                  <li key={s}>
                    <Link
                      href="/services"
                      className="group inline-flex items-center gap-1 text-sm text-cyan-50/80 transition-colors hover:text-white"
                    >
                      {s}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-cyan-200">
                Contact
              </h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-sm text-cyan-50/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  {COMPANY_LOCATION}
                </li>
                <li className="flex items-center gap-3 text-sm text-cyan-50/80">
                  <Mail className="h-4 w-4 shrink-0 text-cyan-300" />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="transition-colors hover:text-white"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 text-sm text-cyan-50/80">
                  <Phone className="h-4 w-4 shrink-0 text-cyan-300 row-span-2 self-center" />
                  <a
                    href={`tel:${CONTACT_PHONE_1}`}
                    className="transition-colors hover:text-white"
                  >
                    {CONTACT_PHONE_1}
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE_2}`}
                    className="transition-colors hover:text-white"
                  >
                    {CONTACT_PHONE_2}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 sm:flex-row">
            <p className="text-sm text-cyan-100/60">
              © {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-cyan-100/60">
              <Link href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Credit */}
          <p className="mt-6 text-center text-xs text-cyan-100/60">
            Crafted with <span aria-hidden="true">❤️</span> &amp; Care by{" "}
            <a
              href={PIGIECORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-100/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Pigiecore Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}