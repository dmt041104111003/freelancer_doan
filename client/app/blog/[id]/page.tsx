"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { blogArticles } from "@/constant/blog";
import { getBlogPostContent } from "@/constant/blog-posts";
import type { BlogTocItem } from "@/types/blog";

export default function BlogPostPage() {
  const params = useParams();
  const id = Number(params.id);
  const article = blogArticles.find((a) => a.id === id);
  const content = getBlogPostContent(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 py-16 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <Link href="/blog" className="text-[#04A0EF] hover:underline">
            ← Quay lại Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const toc: BlogTocItem[] = content?.toc ?? [];
  const intro = content?.intro ?? [article.excerpt];
  const sections = content?.sections ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className={
              toc.length > 0
                ? "grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-8 lg:gap-6"
                : "block"
            }
          >
            {toc.length > 0 && (
              <aside className="lg:col-span-1 order-2 lg:order-1 lg:max-w-[11rem]">
                <nav className="lg:sticky lg:top-24">
                  <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                    Mục lục
                  </h2>
                  <ul className="space-y-1.5 text-xs">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-[#04A0EF] hover:underline leading-tight block"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}

            {/* Nội dung bài viết */}
            <article
              className={
                toc.length > 0
                  ? "lg:col-span-1 order-1 lg:order-2 prose prose-gray max-w-none prose-p:text-justify [&>p]:text-justify"
                  : "prose prose-gray max-w-none prose-p:text-justify [&>p]:text-justify"
              }
            >
              <div className="relative w-full h-[200px] md:h-[280px] rounded-lg overflow-hidden mb-6 not-prose">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0">
                  <span className="inline-block px-4 py-2 bg-[#04A0EF] text-white text-sm font-medium uppercase">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 not-prose">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
                {article.views != null && <span>{article.views} lượt xem</span>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 not-prose">
                {article.title}
              </h1>

              {intro.map((text, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-6">
                  {text}
                </p>
              ))}

              {sections.map((section) => (
                <section key={section.id}>
                  <h2
                    id={section.id}
                    className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24"
                  >
                    {section.title}
                  </h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </section>
              ))}

              {sections.length === 0 && content === null && (
                <p className="text-gray-600 leading-relaxed mb-8">{article.excerpt}</p>
              )}

              <div className="mt-10 pt-6 border-t border-gray-200 not-prose">
                <Link
                  href="/blog"
                  className="text-[#04A0EF] hover:underline font-medium"
                >
                  ← Quay lại Blog
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
