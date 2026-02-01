"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import { HOW_IT_WORKS_STEPS } from "@/constant/how-it-works";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="relative h-[280px] md:h-[350px] overflow-hidden">
          <Image
            src="/background_user.png"
            alt="Cách hoạt động"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                Cách hoạt động
              </h1>
              <p className="text-white/95 text-lg max-w-2xl mx-auto mt-3 drop-shadow-sm">
                Đăng tin, thuê talent, cộng tác và thanh toán đơn giản trên một nền tảng
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.title}
                className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#04A0EF]/30 transition-shadow"
              >
                <Icon name={step.icon} size={28} className="text-[#04A0EF] mb-4" />
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
