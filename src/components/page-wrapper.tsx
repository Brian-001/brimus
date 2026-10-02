"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { WhatsAppWidget } from "@/components/sections/whatsapp-widget";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname === "/login" || pathname.startsWith("/dashboard");

  // Dashboard routes have their own persistent shell (header/sidebar). Wrapping
  // them in a keyed AnimatePresence would unmount and animate the whole shell
  // on every navigation, so they render without the page-transition wrapper.
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
