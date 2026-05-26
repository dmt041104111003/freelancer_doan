# 2.2. Danh mục Use Case theo nhóm quản lý – WorkHub

*Gom theo sơ đồ phân rã chức năng (Hình 2.1). Mỗi dòng là một **nhóm chức năng**; chi tiết từng luồng xem `dac-ta-use-case-chi-tiet*.md`.*

---

## 1. Quản lý người dùng

| Nhóm chức năng | Người làm việc tự do | Người đăng tuyển | Quản trị viên |
|----------------|----------------------|------------------|---------------|
| Đăng ký tài khoản, xác thực email (OTP) | ✓ | ✓ | — |
| Đăng nhập, đăng xuất (email và Google) | ✓ | ✓ | ✓ |
| Khôi phục mật khẩu | ✓ | ✓ | — |
| Cập nhật hồ sơ cá nhân, đổi mật khẩu | ✓ | ✓ | ✓ |
| Đăng ký vai trò người đăng tuyển | ✓* | ✓ | — |
| Tải tệp đính kèm (ảnh, tài liệu) | ✓ | ✓ | — |
| Tra cứu danh sách người làm việc tự do | ✓ | ✓ | — |

*\*Tài khoản đã có có thể thêm vai trò người đăng tuyển.*

---

## 2. Quản lý công việc

| Nhóm chức năng | Người làm việc tự do | Người đăng tuyển | Quản trị viên | Hệ thống |
|----------------|----------------------|------------------|---------------|----------|
| Tra cứu công việc (xem, tìm kiếm, lọc, lưu tin) | ✓ | ✓ | — | — |
| Quản lý tin tuyển dụng (đăng, sửa, đóng, xóa, xem tin của mình) | — | ✓ | — | — |
| Quản lý ứng tuyển (ứng tuyển, rút đơn; duyệt / từ chối ứng viên) | ✓ | ✓ | — | — |
| Quản lý thực hiện công việc (xem việc đang làm, nộp sản phẩm, duyệt / yêu cầu chỉnh sửa) | ✓ | ✓ | — | — |
| Quản lý rút / hủy công việc (gửi, duyệt, từ chối, hủy yêu cầu) | ✓ | ✓ | — | — |
| Quản lý tranh chấp (tạo, phản hồi, xem hồ sơ) | ✓ | ✓ | ✓ | — |
| Xem lịch sử công việc | ✓ | ✓ | ✓ | — |
| Xử lý quá hạn nộp / duyệt sản phẩm | — | — | — | ✓ |

---

## 3. Quản lý tài chính

| Nhóm chức năng | Người làm việc tự do | Người đăng tuyển | Quản trị viên |
|----------------|----------------------|------------------|---------------|
| Nạp tiền ví (VNPay), kiểm tra trạng thái nạp | ✓ | ✓ | — |
| Mua điểm ứng tuyển; nhận điểm khi đăng nhập hàng ngày | ✓ | ✓ | — |
| Xem lịch sử nạp tiền và mua điểm | ✓ | ✓ | — |
| Cấp điểm ứng tuyển thủ công | — | — | ✓ |
| Theo dõi, thống kê giao dịch nạp tiền | — | — | ✓ |

---

## 4. Trao đổi và thông báo

| Nhóm chức năng | Người làm việc tự do | Người đăng tuyển | Quản trị viên |
|----------------|----------------------|------------------|---------------|
| Quản lý kết nối (gửi, chấp nhận, từ chối, hủy lời mời) | ✓ | ✓ | — |
| Trao đổi tin nhắn; đánh dấu đã đọc | ✓ | ✓ | — |
| Chặn / bỏ chặn người dùng | ✓ | ✓ | — |
| Quản lý thông báo (xem, đánh dấu đã đọc) | ✓ | ✓ | — |

---

## 5. Quản trị hệ thống

| Nhóm chức năng | Quản trị viên |
|----------------|---------------|
| Duyệt / từ chối tin tuyển dụng | ✓ |
| Quản lý người dùng (xem, khóa / mở tài khoản) | ✓ |
| Xử lý tranh chấp (phân xử, yêu cầu phản hồi bổ sung) | ✓ |
| Thống kê tổng quan và giao dịch nạp tiền | ✓ |

---

## Gợi ý trình bày trong luận văn (đoạn văn, không bảng)

**Use Case theo nhóm quản lý**

- **Quản lý người dùng:** đăng ký, xác thực, đăng nhập/đăng xuất, khôi phục và đổi mật khẩu, cập nhật hồ sơ, đăng ký vai trò người đăng tuyển, tải tệp, tra cứu người làm việc tự do.

- **Quản lý công việc:** tra cứu tin; người đăng tuyển quản lý tin và ứng viên; hai bên quản lý thực hiện, rút/hủy, tranh chấp và lịch sử; hệ thống xử lý quá hạn.

- **Quản lý tài chính:** nạp ví (VNPay), mua điểm ứng tuyển, lịch sử giao dịch; quản trị viên cấp điểm và thống kê nạp tiền.

- **Trao đổi và thông báo:** kết nối, chat, chặn người dùng, thông báo.

- **Quản trị hệ thống:** duyệt tin, quản lý tài khoản, xử lý tranh chấp, thống kê.

*Tổng **18 nhóm** chức năng (thay cho liệt kê 59 Use Case lẻ). Đặc tả chi tiết từng luồng: Phụ lục / mục 2.2.1–2.2.59 trong `dac-ta-use-case-chi-tiet.md` (3 phần).*
