"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    logo: "/logo.svg",
    companyName: "IDOM Inc.",
    quote: "Đội ngũ kĩ sư của Freelancer đều tốt nghiệp các trường đại học có tiếng trong nước. Bên cạnh đó, họ còn có tinh thần cầu tiến, ham học hỏi và luôn cập nhật các kĩ thuật mới nhất liên quan đến lĩnh vực CNTT. Từ 7/2013 đến nay, chúng tôi đã triển khai rất thuận lại nhiều dự án lớn. Trong tương lai, chúng tôi mong muốn sẽ tiếp tục hợp tác cùng Freelancer trong việc xây dựng hệ thống chính của công ty.",
    companyFullName: "IDom Co.,Ltd",
    personName: "Ông Naoki Sakaguchi",
    position: "Phòng CNTT",
  },
  {
    id: 2,
    logo: "/logo.svg",
    companyName: "Tech Solutions",
    quote: "Chúng tôi rất hài lòng với chất lượng dịch vụ của Freelancer. Đội ngũ chuyên nghiệp, nhiệt tình và luôn đáp ứng đúng deadline. Các dự án được triển khai hiệu quả, tiết kiệm thời gian và chi phí cho doanh nghiệp.",
    companyFullName: "Tech Solutions Corp.",
    personName: "Bà Nguyễn Thị Mai",
    position: "Giám đốc Công nghệ",
  },
  {
    id: 3,
    logo: "/logo.svg",
    companyName: "Digital Agency",
    quote: "Freelancer là đối tác đáng tin cậy trong các dự án phát triển phần mềm của chúng tôi. Sự chuyên nghiệp và cam kết chất lượng của họ đã giúp chúng tôi hoàn thành nhiều dự án quan trọng.",
    companyFullName: "Digital Agency Vietnam",
    personName: "Ông Trần Văn Hùng",
    position: "CEO",
  },
];

// Stats data
const stats = [
  { value: "300", label: "KỸ SƯ" },
  { value: "200", label: "DỰ ÁN" },
  { value: "100", label: "KHÁCH HÀNG" },
  { value: "3,000", label: "M2 DIỆN TÍCH SÀN" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-10">
      {/* Testimonials Section */}
      <div className="relative bg-gradient-to-br from-[#0a2d4a] via-[#0d3a5c] to-[#063752] py-16 md:py-20 overflow-hidden">
        {/* World Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
            {/* World map dots pattern */}
            {Array.from({ length: 50 }).map((_, i) => (
              <circle
                key={i}
                cx={100 + (i % 10) * 100 + Math.random() * 50}
                cy={50 + Math.floor(i / 10) * 100 + Math.random() * 50}
                r={2 + Math.random() * 3}
                fill="#04A0EF"
                opacity={0.3 + Math.random() * 0.5}
              />
            ))}
            {/* Connection lines */}
            <path d="M100,200 Q300,100 500,200 T900,200" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M200,350 Q400,250 600,350 T1000,350" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M0,450 Q200,350 400,450 T800,450" stroke="#04A0EF" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[#04A0EF]  text-lg md:text-xl mb-2">Khách hàng</p>
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold ">
              Nói về chúng tôi
            </h2>
          </div>

          {/* Testimonial Slider */}
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 absolute inset-0 translate-x-8"
                }`}
              >
                {index === currentSlide && (
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Company Logo */}
                    <div className="shrink-0">
                      <div className="w-48 h-32 md:w-64 md:h-40 bg-white rounded-lg shadow-lg flex items-center justify-center p-6">
                        <Image
                          src={testimonial.logo}
                          alt={testimonial.companyName}
                          width={180}
                          height={100}
                          className="object-contain max-h-full"
                        />
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 ">
                        {testimonial.quote}
                      </p>
                      
                      {/* Divider */}
                      <div className="flex justify-center md:justify-start mb-4">
                        <div className="w-12 h-1 bg-[#04A0EF]"></div>
                      </div>
                      
                      {/* Company & Person Info */}
                      <p className="text-[#04A0EF] text-sm mb-1">{testimonial.companyFullName}</p>
                      <p className="text-white font-semibold text-lg md:text-xl">
                        {testimonial.personName} - {testimonial.position}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-[#04A0EF]"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-100 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`py-6 md:py-8 text-center ${
                  index !== stats.length - 1 ? "border-r border-gray-200" : ""
                } ${index >= 2 ? "border-t md:border-t-0 border-gray-200" : ""}`}
              >
                <p className="text-[#04A0EF] text-3xl md:text-4xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-xs md:text-sm font-medium tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
