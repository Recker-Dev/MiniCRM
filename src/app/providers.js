"use client";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import "../styles/globals.css";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <Header />
      <Toaster position="top-right" />
      {children}
    </SessionProvider>
  );
}
