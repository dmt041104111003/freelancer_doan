"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#f5f7fa] py-12 md:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Subtitle */}
            <p className="text-[#04A0EF] text-lg md:text-xl font-medium mb-4">
              Nền tảng Freelancer
            </p>
            
            {/* Main Heading */}
            <h1 className="text-[#2d3748] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Kết nối<br />
              tài năng<br />
              toàn cầu.
            </h1>
            
            {/* Accent Line */}
            <div className="w-16 h-1.5 bg-[#ef4444] mb-8"></div>
            
            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Bằng việc kết nối doanh nghiệp với freelancer chất lượng cao, 
              chúng tôi giúp tăng cường năng lực đội ngũ với các dịch vụ 
              kỹ thuật, sáng tạo và phân tích phù hợp, đảm bảo kết quả lâu dài.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="px-6 py-3 bg-[#04A0EF] text-white font-semibold rounded hover:bg-[#0380BF] transition-colors"
              >
                Tìm việc ngay
              </Link>
              <Link
                href="/my-posted-jobs/create"
                className="px-6 py-3 border-2 border-[#04A0EF] text-[#04A0EF] font-semibold rounded hover:bg-[#04A0EF] hover:text-white transition-colors"
              >
                Đăng dự án
              </Link>
            </div>
          </div>

          {/* Right - Images Stack */}
          <div className="order-1 lg:order-2">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Main large image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/landing/slide1.png"
                  alt="Freelancer Platform"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Overlapping image - top right */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-[45%] z-20 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/landing/slide2.png"
                  alt="Project Management"
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Overlapping image - bottom left */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-[50%] z-20 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/landing/slide3.png"
                  alt="Freelancer Work"
                  width={350}
                  height={250}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#04A0EF]/5 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
