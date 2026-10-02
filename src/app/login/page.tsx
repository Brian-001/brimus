import type { Metadata } from "next";
import { LoginCard } from "@/components/auth/login-card";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginCard />;
}
