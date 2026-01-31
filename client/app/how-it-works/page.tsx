"use client";

import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const HowItWorksFlow = dynamic(
  () => import("@/components/how-it-works/HowItWorksFlow"),
  { ssr: false }
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Cách hoạt động
          </h1>

          <HowItWorksFlow />
        </div>
      </main>

      <Footer />
    </div>
  );
}
