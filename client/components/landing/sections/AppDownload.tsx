"use client";

import { platformFeatures } from "@/constant/landing";

export default function AppDownload() {
  return (
    <section className="relative">
      {/* Header Section - Dark gradient background */}
      <div className="relative bg-gradient-to-br from-[#0a2d4a] via-[#0d3a5c] to-[#063752] py-16 md:py-20 overflow-hidden">
        {/* World Map/Tech Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
            {/* Decorative circles and lines */}
            <circle cx="150" cy="80" r="60" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="150" cy="80" r="40" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="1050" cy="120" r="80" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.4" />
            <circle cx="1050" cy="120" r="50" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.3" />
            {/* Grid lines */}
            <line x1="0" y1="200" x2="400" y2="200" stroke="#04A0EF" strokeWidth="0.5" opacity="0.3" />
            <line x1="800" y1="150" x2="1200" y2="150" stroke="#04A0EF" strokeWidth="0.5" opacity="0.3" />
            {/* Dots pattern */}
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={100 + (i % 5) * 200 + Math.random() * 100}
                cy={50 + Math.floor(i / 5) * 80 + Math.random() * 40}
                r={2}
                fill="#04A0EF"
                opacity={0.4}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          {/* Subtitle */}
          <p className="text-[#04A0EF] text-lg md:text-xl mb-2">
            Nền tảng Freelancer
          </p>
          {/* Main Title */}
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Tại sao chọn Freelancer.vn?
          </h2>
          {/* Accent Line */}
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-[#04A0EF]"></div>
          </div>
        </div>
      </div>

      {/* Content Section - Light background with cards */}
      <div className="relative bg-gray-50 py-12 md:py-16 overflow-hidden">
        {/* World Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
            {/* Simplified world map shapes */}
            <ellipse cx="300" cy="200" rx="150" ry="100" fill="#04A0EF" opacity="0.3" />
            <ellipse cx="600" cy="250" rx="200" ry="120" fill="#04A0EF" opacity="0.2" />
            <ellipse cx="900" cy="180" rx="180" ry="90" fill="#04A0EF" opacity="0.25" />
            {/* Connection lines */}
            <path d="M100,300 Q300,200 500,300 T900,300" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.2" />
            <path d="M200,400 Q400,300 600,400 T1000,400" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.15" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 bg-white/80 backdrop-blur-sm">
            
            {platformFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`p-8 md:p-10 ${
                  index < platformFeatures.length - 1 
                    ? 'border-b md:border-b-0 md:border-r border-gray-200' 
                    : ''
                }`}
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center">
                  {feature.title}
                </h3>
                <ul className="space-y-5">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#04A0EF] text-sm mt-0.5">◆</span>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
