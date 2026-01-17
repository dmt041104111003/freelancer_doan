"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Cách hoạt động
          </h1>

          {/* For Freelancers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#04A0EF] mb-6 flex items-center gap-2">
              <Icon name="person" size={28} />
              Dành cho Freelancer
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-medium text-gray-900">Đăng ký tài khoản</h3>
                  <p className="text-gray-600 text-sm">Tạo tài khoản miễn phí và hoàn thiện hồ sơ của bạn</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-medium text-gray-900">Tìm kiếm công việc</h3>
                  <p className="text-gray-600 text-sm">Duyệt các công việc phù hợp với kỹ năng của bạn</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-medium text-gray-900">Ứng tuyển</h3>
                  <p className="text-gray-600 text-sm">Gửi đơn ứng tuyển với thư giới thiệu của bạn</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-medium text-gray-900">Hoàn thành công việc</h3>
                  <p className="text-gray-600 text-sm">Thực hiện và nộp bài khi hoàn thành</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">5</div>
                <div>
                  <h3 className="font-medium text-gray-900">Nhận thanh toán</h3>
                  <p className="text-gray-600 text-sm">Nhận tiền khi bên thuê duyệt công việc</p>
                </div>
              </div>
            </div>
          </section>

          {/* For Employers */}
          <section>
            <h2 className="text-2xl font-semibold text-[#04A0EF] mb-6 flex items-center gap-2">
              <Icon name="business" size={28} />
              Dành cho Bên thuê
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-medium text-gray-900">Đăng ký và nạp credit</h3>
                  <p className="text-gray-600 text-sm">Tạo tài khoản và nạp credit để đăng việc</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-medium text-gray-900">Đăng việc</h3>
                  <p className="text-gray-600 text-sm">Mô tả công việc, yêu cầu và ngân sách</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-medium text-gray-900">Duyệt ứng viên</h3>
                  <p className="text-gray-600 text-sm">Xem hồ sơ và chọn freelancer phù hợp</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-medium text-gray-900">Thanh toán an toàn</h3>
                  <p className="text-gray-600 text-sm">Tiền được giữ trong hệ thống cho đến khi bạn duyệt công việc</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-[#04A0EF] text-white rounded-full flex items-center justify-center font-bold shrink-0">5</div>
                <div>
                  <h3 className="font-medium text-gray-900">Duyệt kết quả</h3>
                  <p className="text-gray-600 text-sm">Kiểm tra và duyệt khi hài lòng với kết quả</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
