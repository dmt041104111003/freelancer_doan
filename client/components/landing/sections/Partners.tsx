"use client";

import Image from "next/image";

// Core services data
const coreServices = [
  { id: 1, title: "Phát triển Web & Ứng dụng" },
  { id: 2, title: "Thiết kế UI/UX & Đồ họa" },
  { id: 3, title: "Digital Marketing & SEO" },
  { id: 4, title: "Viết nội dung & Dịch thuật" },
];

// Left side highlights
const highlights = [
  "PHÁT TRIỂN PHẦN MỀM CHUYÊN NGHIỆP",
  "KẾT NỐI FREELANCER TOÀN CẦU",
  "18M+ FREELANCER ĐÃ XÁC MINH",
];

export default function Partners() {
  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side - Blue gradient with image */}
        <div className="relative min-h-[400px] lg:min-h-[500px] overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#04A0EF]/90 via-[#0380BF]/80 to-[#065a8c]/90" />
          
          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/landing/slide2.png"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>

          {/* Geometric Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice">
              <polygon points="0,0 200,0 100,150" fill="white" opacity="0.3" />
              <polygon points="150,100 350,50 250,250" fill="white" opacity="0.2" />
              <line x1="0" y1="300" x2="600" y2="200" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="0" y1="350" x2="600" y2="250" stroke="white" strokeWidth="1" opacity="0.2" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 lg:px-16 py-12">
            <div className="space-y-4">
              {highlights.map((text, index) => (
                <p 
                  key={index}
                  className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-tight"
                >
                  - {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - White with services list */}
        <div className="bg-white py-12 lg:py-16 px-8 md:px-12 lg:px-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-[#04A0EF] text-lg md:text-xl font-medium mb-2">
              Dịch vụ
            </p>
            <h2 className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Cốt lõi
            </h2>
            {/* Accent Line */}
            <div className="w-16 h-1 bg-[#04A0EF]"></div>
          </div>

          {/* Services List */}
          <div className="space-y-6">
            {coreServices.map((service) => (
              <div 
                key={service.id}
                className="flex items-center gap-6 py-4 border-b border-gray-100 hover:border-[#04A0EF]/30 transition-colors group"
              >
                {/* Number */}
                <span className="text-[#04A0EF]/40 text-2xl md:text-3xl font-light min-w-[40px]">
                  {service.id}
                </span>
                {/* Title */}
                <h3 className="text-gray-800 text-lg md:text-xl font-semibold group-hover:text-[#04A0EF] transition-colors">
                  {service.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
