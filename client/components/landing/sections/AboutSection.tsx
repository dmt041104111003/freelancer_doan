"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

// Demo job data
const jobOpportunities = [
  {
    id: 1,
    title: "Lập trình viên Frontend (ReactJS)",
    isUrgent: true,
    deadline: null,
    level: "Middle",
    location: "Remote",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    isUrgent: true,
    deadline: null,
    level: "Senior",
    location: "Hà Nội",
  },
  {
    id: 3,
    title: "Content Writer",
    isUrgent: false,
    deadline: "20/02/2026",
    level: "Junior",
    location: "Remote",
  },
  {
    id: 4,
    title: "Backend Developer (NodeJS)",
    isUrgent: true,
    deadline: null,
    level: "Senior",
    location: "TP. HCM",
  },
  {
    id: 5,
    title: "Digital Marketing Specialist",
    isUrgent: false,
    deadline: "25/02/2026",
    level: "Middle",
    location: "Remote",
  },
];

export default function AboutSection() {
  return (
    <section className="py-16 md:py-20 bg-[#f5f7fa]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[#04A0EF] text-lg md:text-xl font-medium mb-2">
            Cơ hội việc làm
          </p>
          <h2 className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Dành cho Freelancer
          </h2>
          {/* Accent Line */}
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-[#04A0EF]"></div>
          </div>
        </div>

        {/* Job Listings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
            <div className="col-span-4">Vị trí</div>
            <div className="col-span-2 text-center">Trạng thái</div>
            <div className="col-span-2 text-center">Cấp bậc</div>
            <div className="col-span-2 text-center">Địa điểm</div>
            <div className="col-span-2 text-right">Thao tác</div>
          </div>

          {/* Job Rows */}
          {jobOpportunities.map((job, index) => (
            <div
              key={job.id}
              className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 items-center ${
                index !== jobOpportunities.length - 1 ? "border-b border-gray-100" : ""
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Job Title */}
              <div className="md:col-span-4">
                <Link 
                  href={`/jobs/${job.id}`}
                  className="text-[#04A0EF] font-semibold text-base md:text-lg hover:underline"
                >
                  {job.title}
                </Link>
              </div>

              {/* Status/Deadline */}
              <div className="md:col-span-2 flex md:justify-center">
                {job.isUrgent ? (
                  <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                    Tuyển gấp
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-gray-600 text-sm">
                    <Icon name="schedule" size={16} />
                    {job.deadline}
                  </span>
                )}
              </div>

              {/* Level */}
              <div className="md:col-span-2 md:text-center">
                <span className="text-gray-700 text-sm md:text-base">{job.level}</span>
              </div>

              {/* Location */}
              <div className="md:col-span-2 md:text-center">
                <span className="text-gray-700 text-sm md:text-base">{job.location}</span>
              </div>

              {/* Apply Link */}
              <div className="md:col-span-2 md:text-right mt-2 md:mt-0">
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center gap-1 text-[#04A0EF] font-medium hover:underline text-sm md:text-base"
                >
                  Ứng tuyển
                  <Icon name="chevron_right" size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#04A0EF] text-white font-semibold rounded hover:bg-[#0380BF] transition-colors"
          >
            Xem tất cả việc làm
            <Icon name="arrow_forward" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
