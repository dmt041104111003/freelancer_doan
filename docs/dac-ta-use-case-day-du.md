# 2.2. Đặc tả Use Case chi tiết – WorkHub

**Tác nhân:** Freelancer (FL), Employer (EM), Quản trị viên (AD).  
**Hệ thống:** WorkHub – website hỗ trợ kết nối việc làm tự do.

---

## Nhóm A – Xác thực và tài khoản

### Bảng 2.1 – Use Case Đăng ký tài khoản

| | |
|---|---|
| **Mô tả** | Người dùng tạo tài khoản mới trên hệ thống bằng email. |
| **Tác nhân** | FL, EM |
| **Kích hoạt** | Chọn chức năng đăng ký |
| **Điều kiện trước** | Email chưa tồn tại trong hệ thống |
| **Điều kiện sau** | Tài khoản được tạo (chưa xác thực email); OTP gửi qua email |
| **Luồng chính** | 1. Truy cập trang đăng ký. 2. Nhập email, mật khẩu, họ tên (và SĐT nếu có). 3. Gửi form. 4. Hệ thống lưu tài khoản, gán vai trò Freelancer mặc định, gửi OTP. 5. Chuyển màn hình nhập OTP. |
| **Luồng thay thế** | — |
| **Ngoại lệ** | Email đã tồn tại → thông báo lỗi. Dữ liệu không hợp lệ → yêu cầu nhập lại. |
| **Thông tin khác** | Mật khẩu mã hóa BCrypt trước khi lưu. |

### Bảng 2.2 – Use Case Xác thực OTP (đăng ký)

| | |
|---|---|
| **Mô tả** | Xác thực email sau đăng ký bằng mã OTP. |
| **Tác nhân** | FL, EM |
| **Kích hoạt** | Hoàn tất đăng ký hoặc chọn gửi lại OTP |
| **Điều kiện trước** | Đã đăng ký; OTP còn hiệu lực (Redis) |
| **Điều kiện sau** | `emailVerified = true`; đăng nhập tự động (JWT + cookie) |
| **Luồng chính** | 1. Nhập OTP. 2. Hệ thống kiểm tra OTP. 3. Kích hoạt email. 4. Cấp phiên đăng nhập. |
| **Thay thế** | **2a.** Chọn gửi lại OTP → hệ thống gửi mã mới (cooldown). |
| **Ngoại lệ** | OTP sai/hết hạn → thông báo lỗi. |

### Bảng 2.3 – Use Case Đăng nhập

| | |
|---|---|
| **Mô tả** | Tác nhân đăng nhập để sử dụng chức năng theo vai trò. |
| **Tác nhân** | FL, EM, AD |
| **Kích hoạt** | Truy cập trang đăng nhập |
| **Điều kiện trước** | Tài khoản tồn tại; email đã xác thực; tài khoản enabled |
| **Điều kiện sau** | JWT + refresh token (HTTP-only cookie); chuyển trang chủ |
| **Luồng chính** | 1. Trang đăng nhập. 2. Nhập email, mật khẩu. 3. Xác thực thành công. 4. Cộng 10 điểm ứng tuyển/ngày (nếu chưa nhận). 5. Vào hệ thống. |
| **Thay thế** | **2a.** Đăng nhập Google → xác thực Google → tạo/link tài khoản → vào hệ thống. |
| **Ngoại lệ** | Sai MK/email; email chưa xác thực (gửi lại OTP); tài khoản bị khóa; Google lỗi. |

### Bảng 2.4 – Use Case Đăng xuất

| | |
|---|---|
| **Mô tả** | Kết thúc phiên làm việc. |
| **Tác nhân** | FL, EM, AD |
| **Điều kiện trước** | Đã đăng nhập |
| **Điều kiện sau** | Refresh token bị xóa; cookie hết hiệu lực |
| **Luồng chính** | 1. Chọn Đăng xuất. 2. Hệ thống xóa token. 3. Về trang công khai/đăng nhập. |

### Bảng 2.5 – Use Case Quên mật khẩu

| | |
|---|---|
| **Mô tả** | Gửi OTP để đặt lại mật khẩu. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | 1. Nhập email. 2. Hệ thống gửi OTP (FORGOT_PASSWORD). 3. Chuyển màn hình đặt lại MK. |
| **Ngoại lệ** | Email không tồn tại → thông báo (hoặc thông báo chung vì bảo mật). |

### Bảng 2.6 – Use Case Đặt lại mật khẩu

| | |
|---|---|
| **Mô tả** | Đổi mật khẩu sau khi xác thực OTP quên MK. |
| **Tác nhân** | FL, EM |
| **Điều kiện trước** | OTP hợp lệ |
| **Điều kiện sau** | MK mới lưu; toàn bộ refresh token cũ bị xóa |
| **Luồng chính** | 1. Nhập OTP + MK mới. 2. Xác thực OTP. 3. Cập nhật MK. 4. Thông báo thành công → đăng nhập lại. |

### Bảng 2.7 – Use Case Đổi mật khẩu

| | |
|---|---|
| **Mô tả** | Đổi MK khi đã đăng nhập. |
| **Tác nhân** | FL, EM, AD |
| **Điều kiện trước** | Đã đăng nhập; MK hiện tại đúng |
| **Luồng chính** | 1. Nhập MK cũ, MK mới. 2. Hệ thống kiểm tra và cập nhật. |

### Bảng 2.8 – Use Case Cập nhật hồ sơ

| | |
|---|---|
| **Mô tả** | Cập nhật thông tin cá nhân. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | 1. Trang hồ sơ. 2. Sửa: họ tên, bio, avatar, ảnh bìa, kỹ năng, SĐT, ngân hàng (FL), trạng thái sẵn sàng nhận việc. 3. Lưu. |
| **Thông tin khác** | Avatar/ảnh bìa qua upload Cloudinary. |

### Bảng 2.9 – Use Case Đăng ký vai trò Employer

| | |
|---|---|
| **Mô tả** | Thêm quyền đăng tin tuyển dụng. |
| **Tác nhân** | FL (đã có tài khoản) |
| **Điều kiện sau** | Tài khoản có thêm `ROLE_EMPLOYER` |
| **Luồng chính** | 1. Chọn “Trở thành người đăng tuyển”. 2. Hệ thống gán role. 3. Cho phép đăng job. |

### Bảng 2.10 – Use Case Tải tệp đính kèm

| | |
|---|---|
| **Mô tả** | Upload ảnh/tài liệu lên Cloudinary. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | 1. Chọn file + usage (avatar, cover, job work, chat, dispute…). 2. Upload API. 3. Trả URL/fileId. |
| **Ngoại lệ** | Quá dung lượng/định dạng → lỗi. |

### Bảng 2.11 – Use Case Tra cứu danh sách Freelancer

| | |
|---|---|
| **Mô tả** | Xem danh sách FL công khai. |
| **Tác nhân** | FL, EM (có thể xem khi chưa đăng nhập – API public) |
| **Luồng chính** | 1. Trang Freelancers. 2. Hệ thống trả danh sách phân trang, sắp xếp. |

---

## Nhóm B – Tra cứu và lưu công việc

### Bảng 2.12 – Use Case Xem danh sách công việc

| | |
|---|---|
| **Mô tả** | Xem job trạng thái OPEN. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | 1. Trang Jobs. 2. Hiển thị danh sách phân trang. |

### Bảng 2.13 – Use Case Xem chi tiết công việc

| | |
|---|---|
| **Mô tả** | Xem thông tin đầy đủ một job. |
| **Luồng chính** | 1. Chọn job. 2. Hiển thị mô tả, ngân sách, kỹ năng, deadline… 3. Tăng lượt xem. |

### Bảng 2.14 – Use Case Tìm kiếm công việc

| | |
|---|---|
| **Mô tả** | Tìm theo từ khóa trong tiêu đề/mô tả. |
| **Luồng chính** | 1. Nhập từ khóa. 2. API search. 3. Hiển thị kết quả OPEN. |

### Bảng 2.15 – Use Case Lọc công việc theo kỹ năng

| | |
|---|---|
| **Mô tả** | Lọc job theo danh sách kỹ năng. |
| **Luồng chính** | 1. Chọn kỹ năng. 2. API by-skills. 3. Hiển thị kết quả. |

### Bảng 2.16 – Use Case Lưu / Bỏ lưu công việc

| | |
|---|---|
| **Mô tả** | Đánh dấu job quan tâm. |
| **Tác nhân** | FL |
| **Điều kiện trước** | Đã đăng nhập |
| **Luồng chính** | 1. Chọn lưu/bỏ lưu (toggle). 2. Cập nhật bảng saved_jobs. 3. Xem danh sách job đã lưu. |

---

## Nhóm C – Quản lý tin tuyển dụng (Employer)

### Bảng 2.17 – Use Case Đăng tin tuyển dụng

| | |
|---|---|
| **Mô tả** | EM tạo tin; hệ thống giữ ký quỹ. |
| **Tác nhân** | EM |
| **Điều kiện trước** | Có role Employer; số dư ví ≥ budget + 5% phí |
| **Điều kiện sau** | Job `PENDING_APPROVAL`; escrow đã trừ |
| **Luồng chính** | 1. Form tạo job. 2. Nhập tiêu đề, mô tả, budget, deadline ứng tuyển, số ngày nộp/duyệt, kỹ năng… 3. Trừ ví (budget+phí). 4. Lưu job chờ Admin. |
| **Ngoại lệ** | Không đủ số dư → từ chối. |

### Bảng 2.18 – Use Case Sửa tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Chỉnh sửa tin ở trạng thái DRAFT, chưa có ứng tuyển/UV được chọn. |
| **Tác nhân** | EM |
| **Điều kiện trước** | Job DRAFT; chưa có application; chưa có UV accepted |
| **Luồng chính** | 1. Mở form sửa. 2. Cập nhật. 3. Lưu. |

### Bảng 2.19 – Use Case Đóng tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Đóng job (không nhận thêm UV). |
| **Tác nhân** | EM |
| **Luồng chính** | 1. Chọn đóng. 2. Cập nhật trạng thái CLOSED. |

### Bảng 2.20 – Use Case Chuyển trạng thái tin (Draft/Open)

| | |
|---|---|
| **Mô tả** | Toggle giữa bản nháp và gửi duyệt (theo logic `toggle-status`). |
| **Tác nhân** | EM |

### Bảng 2.21 – Use Case Xóa tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Xóa job (theo quyền và trạng thái cho phép). |
| **Tác nhân** | EM |

### Bảng 2.22 – Use Case Xem tin đã đăng

| | |
|---|---|
| **Mô tả** | Danh sách job của EM, lọc theo trạng thái. |
| **Tác nhân** | EM |
| **Luồng chính** | 1. Trang my-posted-jobs. 2. API my-jobs. |

---

## Nhóm D – Ứng tuyển và tuyển chọn

### Bảng 2.23 – Use Case Ứng tuyển công việc

| | |
|---|---|
| **Mô tả** | FL gửi đơn + cover letter. |
| **Tác nhân** | FL |
| **Điều kiện trước** | Job OPEN; đủ 1 điểm ứng tuyển; chưa UV hoặc đã rút đơn |
| **Điều kiện sau** | Đơn PENDING; trừ 1 điểm; thông báo EM |
| **Luồng chính** | 1. Chi tiết job → Ứng tuyển. 2. Nhập thư GT. 3. Trừ điểm. 4. Lưu đơn. |
| **Ngoại lệ** | Không đủ điểm; tự ứng tuyển job mình; job không OPEN. |

### Bảng 2.24 – Use Case Rút đơn ứng tuyển

| | |
|---|---|
| **Mô tả** | FL hủy đơn đang chờ. |
| **Tác nhân** | FL |
| **Luồng chính** | 1. Chọn rút đơn. 2. Cập nhật trạng thái withdrawn. |

### Bảng 2.25 – Use Case Xem danh sách ứng viên

| | |
|---|---|
| **Mô tả** | EM xem UV của job. |
| **Tác nhân** | EM |
| **Luồng chính** | 1. Trang applications của job. 2. API list applications. |

### Bảng 2.26 – Use Case Chấp nhận ứng viên

| | |
|---|---|
| **Mô tả** | EM chọn một FL. |
| **Tác nhân** | EM |
| **Điều kiện sau** | Job IN_PROGRESS; deadline nộp SP; các đơn PENDING khác bị từ chối |
| **Luồng chính** | 1. Chọn chấp nhận. 2. Cập nhật job + đơn. 3. Từ chối đơn còn lại. 4. Thông báo. |

### Bảng 2.27 – Use Case Từ chối ứng viên

| | |
|---|---|
| **Mô tả** | EM từ chối từng đơn PENDING. |
| **Tác nhân** | EM |

---

## Nhóm E – Thực hiện công việc

### Bảng 2.28 – Use Case Nộp sản phẩm

| | |
|---|---|
| **Mô tả** | FL nộp bài khi job IN_PROGRESS. |
| **Tác nhân** | FL |
| **Điều kiện sau** | Work SUBMITTED; deadline duyệt cho EM |
| **Luồng chính** | 1. Nhập link/ghi chú/file. 2. Lưu. 3. Thông báo EM. |

### Bảng 2.29 – Use Case Duyệt sản phẩm

| | |
|---|---|
| **Mô tả** | EM chấp nhận SP → hoàn thành job. |
| **Tác nhân** | EM |
| **Điều kiện sau** | Job COMPLETED; chuyển budget từ escrow vào ví FL; +1 trust cả hai |
| **Luồng chính** | 1. Xem SP. 2. Duyệt. 3. Chi trả. 4. Thông báo. |

### Bảng 2.30 – Use Case Yêu cầu chỉnh sửa sản phẩm

| | |
|---|---|
| **Mô tả** | EM yêu cầu FL sửa lại. |
| **Tác nhân** | EM |
| **Điều kiện sau** | REVISION_REQUESTED; FL nộp lại được |
| **Luồng chính** | 1. Nhập ghi chú. 2. Gửi yêu cầu. 3. Thông báo FL. |

### Bảng 2.31 – Use Case Xem công việc đang thực hiện

| | |
|---|---|
| **Mô tả** | FL xem job đã được chọn. |
| **Tác nhân** | FL |
| **Luồng chính** | 1. my-accepted-jobs / my-working-jobs. 2. Thống kê (stats API). |

### Bảng 2.32 – Use Case Xử lý quá hạn (hệ thống)

| | |
|---|---|
| **Mô tả** | Scheduler tự động khi quá hạn nộp/duyệt. |
| **Tác nhân** | Hệ thống |
| **Luồng chính** | Quá hạn nộp → xử lý hoàn/hủy theo rule. Quá hạn duyệt → auto duyệt SP và chi trả. |

---

## Nhóm F – Rút / Hủy công việc

### Bảng 2.33 – Use Case Freelancer xin rút việc

| | |
|---|---|
| **Mô tả** | FL xin rút khi IN_PROGRESS. |
| **Tác nhân** | FL |
| **Điều kiện trước** | Đủ số dư phí phạt 12% escrow |
| **Luồng chính** | 1. Nhập lý do. 2. Trừ phí phạt ngay. 3. Tạo yêu cầu PENDING. 4. Thông báo EM. |

### Bảng 2.34 – Use Case Employer xin hủy việc

| | |
|---|---|
| **Mô tả** | EM xin hủy job IN_PROGRESS. |
| **Tác nhân** | EM |
| **Điều kiện trước** | Phí phạt 40% escrow trong ví |
| **Luồng chính** | Tương 2.33 với phí 40%. |

### Bảng 2.35 – Use Case Duyệt yêu cầu rút/hủy

| | |
|---|---|
| **Mô tả** | Bên còn lại chấp nhận. |
| **Tác nhân** | FL hoặc EM (người không tạo yêu cầu) |
| **Điều kiện sau** | Job CANCELLED; hoàn escrow cho EM |
| **Luồng chính** | 1. Chọn duyệt. 2. Hủy job. 3. Hoàn tiền. |

### Bảng 2.36 – Use Case Từ chối yêu cầu rút/hủy

| | |
|---|---|
| **Mô tả** | Bên kia từ chối; job tiếp tục. |
| **Tác nhân** | FL hoặc EM |

### Bảng 2.37 – Use Case Hủy yêu cầu rút/hủy (người gửi)

| | |
|---|---|
| **Mô tả** | Người tạo hủy yêu cầu đang chờ. |
| **Tác nhân** | Người tạo yêu cầu |

---

## Nhóm G – Tranh chấp

### Bảng 2.38 – Use Case Employer tạo tranh chấp

| | |
|---|---|
| **Mô tả** | Khiếu nại sau khi FL đã nộp SP. |
| **Tác nhân** | EM |
| **Điều kiện trước** | IN_PROGRESS; FL đã nộp SP; chưa có dispute active |
| **Điều kiện sau** | Job DISPUTED; chờ phản hồi FL |
| **Luồng chính** | 1. Mô tả + bằng chứng. 2. Lưu dispute. 3. Thông báo FL. |

### Bảng 2.39 – Use Case Freelancer phản hồi tranh chấp

| | |
|---|---|
| **Mô tả** | FL gửi phản hồi + bằng chứng. |
| **Tác nhân** | FL |
| **Điều kiện sau** | PENDING_ADMIN_DECISION |
| **Luồng chính** | 1. Nhập phản hồi. 2. Lưu. 3. Chờ Admin. |

### Bảng 2.40 – Use Case Freelancer tạo tranh chấp

| | |
|---|---|
| **Mô tả** | FL khiếu nại sau ≥3 lần yêu cầu chỉnh sửa (WORK_REJECTED). |
| **Tác nhân** | FL |
| **Điều kiện sau** | DISPUTED; thẳng chờ Admin |

### Bảng 2.41 – Use Case Xem thông tin tranh chấp

| | |
|---|---|
| **Mô tả** | EM/FL xem dispute theo job. |
| **Tác nhân** | EM, FL |

### Bảng 2.42 – Use Case Admin phân xử tranh chấp

| | |
|---|---|
| **Mô tả** | AD quyết định bên thắng. |
| **Tác nhân** | AD |
| **Luồng chính** | 1. Xem hồ sơ. 2. Chọn EM thắng / FL thắng. 3. Chuyển/hoàn tiền. 4. Thông báo. |

### Bảng 2.43 – Use Case Admin yêu cầu phản hồi bổ sung

| | |
|---|---|
| **Mô tả** | AD gia hạn thời gian FL phản hồi. |
| **Tác nhân** | AD |

---

## Nhóm H – Tài chính

### Bảng 2.44 – Use Case Nạp tiền VNPay

| | |
|---|---|
| **Mô tả** | Nạp ví qua VNPay. |
| **Tác nhân** | EM (chủ yếu) |
| **Luồng chính** | 1. Nhập số tiền (≥10.000đ). 2. Tạo đơn PENDING + URL VNPay. 3. Chuyển VNPay thanh toán. 4. IPN/return xác nhận → cộng ví. |

### Bảng 2.45 – Use Case Kiểm tra trạng thái nạp tiền

| | |
|---|---|
| **Mô tả** | Tra cứu đơn nạp theo appTransId. |
| **Tác nhân** | EM |

### Bảng 2.46 – Use Case Mua điểm ứng tuyển

| | |
|---|---|
| **Mô tả** | Đổi số dư ví lấy điểm (gói credits). |
| **Tác nhân** | FL, EM |
| **Luồng chính** | 1. Chọn gói. 2. Trừ ví. 3. Cộng điểm. |

### Bảng 2.47 – Use Case Xem lịch sử nạp tiền / mua điểm

| | |
|---|---|
| **Mô tả** | Lịch sử giao dịch ví. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | Trang wallet – my-deposits, my-purchases. |

---

## Nhóm I – Chat và thông báo

### Bảng 2.48 – Use Case Gửi yêu cầu kết nối

| | |
|---|---|
| **Mô tả** | Gửi lời mời kết bạn kèm tin nhắn đầu. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | 1. Tìm user (email). 2. Gửi request. |

### Bảng 2.49 – Use Case Chấp nhận / Từ chối / Hủy yêu cầu kết nối

| | |
|---|---|
| **Mô tả** | Xử lý lời mời pending/sent. |
| **Tác nhân** | FL, EM |

### Bảng 2.50 – Use Case Trao đổi tin nhắn

| | |
|---|---|
| **Mô tả** | Chat 1-1 realtime (REST + WebSocket). |
| **Tác nhân** | FL, EM |
| **Luồng chính** | Gửi text/ảnh/file; reply; sửa/xóa tin của mình. |

### Bảng 2.51 – Use Case Đánh dấu tin nhắn đã đọc

| | |
|---|---|
| **Mô tả** | Mark read conversation. |
| **Tác nhân** | FL, EM |

### Bảng 2.52 – Use Case Chặn / Bỏ chặn người dùng

| | |
|---|---|
| **Mô tả** | Block/unblock trong hội thoại. |
| **Tác nhân** | FL, EM |

### Bảng 2.53 – Use Case Quản lý thông báo

| | |
|---|---|
| **Mô tả** | Xem, đánh dấu đã đọc, đọc tất cả. |
| **Tác nhân** | FL, EM |
| **Luồng chính** | API notifications + realtime push. |

### Bảng 2.54 – Use Case Xem lịch sử công việc

| | |
|---|---|
| **Mô tả** | Job history theo job. |
| **Tác nhân** | FL, EM, AD |
| **Luồng chính** | API job/{id}/history. |

---

## Nhóm J – Quản trị

### Bảng 2.55 – Use Case Admin duyệt tin tuyển dụng

| | |
|---|---|
| **Tác nhân** | AD |
| **Luồng chính** | 1. Danh sách PENDING_APPROVAL. 2. Approve → OPEN. 3. Thông báo EM. |

### Bảng 2.56 – Use Case Admin từ chối tin tuyển dụng

| | |
|---|---|
| **Tác nhân** | AD |
| **Luồng chính** | 1. Nhập lý do. 2. Reject. 3. Hoàn escrow EM. |

### Bảng 2.57 – Use Case Admin quản lý người dùng

| | |
|---|---|
| **Tác nhân** | AD |
| **Luồng chính** | Xem list; enable/disable tài khoản. |

### Bảng 2.58 – Use Case Admin cấp điểm ứng tuyển

| | |
|---|---|
| **Tác nhân** | AD |
| **Luồng chính** | Nhập số điểm → cộng cho user. |

### Bảng 2.59 – Use Case Admin thống kê / xem giao dịch nạp

| | |
|---|---|
| **Tác nhân** | AD |
| **Luồng chính** | statistics + all deposits. |

---

## Danh mục Use Case (tổng hợp – 59 UC)

| STT | Use Case | Tác nhân |
|-----|----------|----------|
| 1 | Đăng ký | FL, EM |
| 2 | Xác thực OTP | FL, EM |
| 3 | Đăng nhập | FL, EM, AD |
| 4 | Đăng xuất | FL, EM, AD |
| 5 | Quên MK | FL, EM |
| 6 | Đặt lại MK | FL, EM |
| 7 | Đổi MK | FL, EM, AD |
| 8 | Cập nhật hồ sơ | FL, EM |
| 9 | Đăng ký Employer | FL |
| 10 | Tải file | FL, EM |
| 11 | Tra cứu FL | FL, EM |
| 12–16 | Tra cứu/lưu job | FL, EM |
| 17–22 | Quản lý tin TD | EM |
| 23–27 | Ứng tuyển/tuyển chọn | FL, EM |
| 28–32 | Thực hiện CV | FL, EM, HT |
| 33–37 | Rút/hủy | FL, EM |
| 38–43 | Tranh chấp | FL, EM, AD |
| 44–47 | Tài chính | FL, EM |
| 48–54 | Chat, TB, lịch sử | FL, EM |
| 55–59 | Admin | AD |

*HT = Hệ thống (scheduler)*

---

**Ghi chú đồ án:** Khi chép vào Word, mở rộng từng bảng thêm cột *Luồng thay thế / Ngoại lệ* chi tiết như mẫu Bảng 2.3 (Đăng nhập). File này liệt kê đủ UC không bỏ sót theo mã nguồn WorkHub.
