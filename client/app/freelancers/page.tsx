"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";

export default function FreelancersPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <Icon name="engineering" size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-400 mb-2">
            Tìm Freelancer
          </h1>
          <p className="text-gray-400">
            Tính năng đang được phát triển...
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
