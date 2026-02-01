"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { blogArticles, BLOG_TAGS } from "@/constant/blog";
import type { BlogTagId } from "@/types/blog";

export default function BlogGrid() {
  const [activeTag, setActiveTag] = useState<"all" | BlogTagId>("all");

  const filteredArticles =
    activeTag === "all"
      ? blogArticles
      : blogArticles.filter((article) => article.tags.includes(activeTag));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {BLOG_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setActiveTag(tag.id)}
            className={`px-6 py-2.5 text-sm font-medium border transition-colors rounded ${
              activeTag === tag.id
                ? "bg-[#04A0EF] text-white border-[#04A0EF]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#04A0EF] hover:text-[#04A0EF]"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {filteredArticles.slice(0, 6).map((article) => (
          <article 
            key={article.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            <Link href={`/blog/${article.id}`} className="relative group">
              <div className="relative h-[250px] md:h-[300px] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-0 left-0">
                <span className="inline-block px-4 py-2 bg-[#04A0EF] text-white text-sm font-medium uppercase">
                  {article.category}
                </span>
              </div>
            </Link>

            <div className="flex flex-col justify-center">
              <Link href={`/blog/${article.id}`}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-[#04A0EF] transition-colors mb-4 leading-tight">
                  {article.title}
                </h2>
              </Link>

              <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                <span className="flex items-center gap-1.5">
                  <Icon name="calendar_today" size={16} />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="visibility" size={16} />
                  {article.views || 0}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {article.excerpt}
              </p>

              <div>
                <Link
                  href={`/blog/${article.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-colors"
                >
                  XEM THÊM
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length > 6 && (
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#04A0EF] text-white font-semibold rounded hover:bg-[#0380BF] transition-colors"
          >
            Xem thêm bài viết
            <Icon name="arrow_forward" size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
