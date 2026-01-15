"use client";

import Link from "next/link";
import { supportInfo } from "@/constant/landing";

export default function HotlineSupport() {
  return (
    <section className="bg-[#1a3a4a] py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {supportInfo.title}
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
          {supportInfo.subtitle}
        </p>
        
        {/* CTA Button */}
        <Link
          href={supportInfo.buttonLink}
          className="inline-block px-8 py-3 border-2 border-white text-white text-sm md:text-base font-semibold tracking-wider hover:bg-white hover:text-[#1a3a4a] transition-all duration-300"
        >
          {supportInfo.buttonText}
        </Link>
      </div>
    </section>
  );
}
