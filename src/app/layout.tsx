import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessengerWidget } from "@/components/MessengerWidget";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "GravMix - Подарки с гравировкой | Браслеты, Жетоны, Брелоки",
  description: "Персонализированные подарки с бесплатной гравировкой. Браслеты, жетоны, брелоки и коробочки премиум качества. Быстрая доставка по РФ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "GravMix", "version": "1.0.0", "greeting": "hi"}'
        />
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <MessengerWidget />
          <ScrollToTop />
          <CookieConsent />
          <Toaster />
        </Providers>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}