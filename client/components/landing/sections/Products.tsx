"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { freelanceServices, servicesHeader } from "@/constant/landing";

export default function Products() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[#04A0EF] text-lg md:text-xl mb-2">
            {servicesHeader.subtitle}
          </p>
          <h2 className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-bold">
            {servicesHeader.title}
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white hover:bg-gray-50 transition-all ${
              !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:border-gray-600"
            }`}
          >
            <Icon name="chevron_left" size={24} className="text-gray-600" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {freelanceServices.map((service, index) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-[200px] md:w-[220px] bg-white border border-gray-200 p-6 relative overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Background Number */}
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[80px] md:text-[100px] font-bold text-gray-100 leading-none select-none pointer-events-none">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  {/* Category Label */}
                  <p className="text-gray-600 text-sm mb-2">{service.category}</p>
                  
                  {/* Accent Line */}
                  <div className="w-8 h-0.5 bg-[#04A0EF] mb-3"></div>
                  
                  {/* Title */}
                  <h3 className="text-gray-800 font-bold text-base md:text-lg leading-tight mb-2">
                    {service.title}
                  </h3>

                  {/* Freelancer Count */}
                  <p className="text-[#04A0EF] text-sm font-medium">
                    {service.freelancerCount.toLocaleString()}+ freelancer
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white hover:bg-gray-50 transition-all ${
              !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:border-gray-600"
            }`}
          >
            <Icon name="chevron_right" size={24} className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
