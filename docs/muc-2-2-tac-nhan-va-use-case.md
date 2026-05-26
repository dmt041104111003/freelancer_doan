# 2.2. Mô hình Use Case – WorkHub (bám triển khai thực tế)

*Nguồn đối chiếu: mã nguồn `backend` (Spring Boot), `client` (Next.js). Không mô tả chức năng chưa triển khai.*

---

## 2.2.1. Xác định các tác nhân

Hệ thống có **ba tác nhân chính** tương tác qua giao diện web:

| Tác nhân | Vai trò trong hệ thống |
|----------|------------------------|
| **Người làm việc tự do** | Tìm việc, ứng tuyển (trừ điểm ứng tuyển), nộp sản phẩm, trao đổi với người đăng tuyển. |
| **Người đăng tuyển** | Đăng tin (trừ ví làm ký quỹ), chọn ứng viên, duyệt hoặc yêu cầu chỉnh sửa sản phẩm. |
| **Quản trị viên** | Duyệt tin, quản lý tài khoản, xử lý tranh chấp, theo dõi giao dịch nạp tiền. |

**Hệ thống** (tác nhân phụ, không đăng nhập): tiến trình nền xử lý quá hạn nộp hoặc duyệt sản phẩm (chạy định kỳ), gửi thông báo theo sự kiện.

**Quy ước tài khoản**

- Đăng ký mới mặc định là **người làm việc tự do**; có thể **thêm vai trò người đăng tuyển** trên cùng một tài khoản (`POST /api/users/me/become-employer`).
- Một người có thể vừa làm việc tự do vừa đăng tuyển; quyền thao tác phụ thuộc vai trò khi đăng nhập.
- Hệ thống **không** có tác nhân khách (xem tin công khai không cần đăng nhập, nhưng không được coi là tác nhân riêng).

---

## 2.2.2. Xác định các Use Case

Các Use Case dưới đây **khớp chức năng đã code**. Đặc tả bảng theo nhóm quản lý: **mục 2.2.3** (`dac-ta-use-case-theo-quan-ly.md` — 13 bảng).

### Use Case chung (người làm việc tự do và người đăng tuyển)

**Quản lý tài khoản**

- Đăng ký bằng email; xác thực email qua mã OTP (Redis).
- Đăng nhập, đăng xuất bằng email và mật khẩu hoặc **Google OAuth**.
- Quên mật khẩu và đặt lại mật khẩu (OTP qua email).
- Cập nhật hồ sơ; đổi mật khẩu khi đã đăng nhập.
- **Nhận 10 điểm ứng tuyển mỗi ngày** lần đăng nhập đầu tiên trong ngày (nếu chưa nhận).
- Tải tệp đính kèm lên Cloudinary (ảnh, tài liệu: hồ sơ, nộp bài, chat, tranh chấp).

**Tra cứu (một phần không cần đăng nhập)**

- Tra cứu tin công việc đang mở: xem danh sách, chi tiết, tìm kiếm, lọc theo kỹ năng (API công khai).
- **Lưu / bỏ lưu tin** (cần đăng nhập).
- Tra cứu danh sách người làm việc tự do (API công khai, có phân trang).

**Trao đổi và thông báo**

- Gửi, chấp nhận, từ chối, hủy **yêu cầu kết nối** (mở chat một-một).
- Trao đổi tin nhắn (REST và WebSocket STOMP); sửa, xóa tin của mình; đánh dấu đã đọc.
- **Chặn / bỏ chặn** theo hội thoại.
- Xem thông báo; đánh dấu đã đọc từng mục hoặc tất cả.

**Quản lý tài chính**

- **Nạp tiền vào ví qua VNPay** (cổng đang dùng trên giao diện; tối thiểu 10.000 đồng). *ZaloPay có trong backend nhưng trên UI đang tắt.*
- Kiểm tra trạng thái giao dịch nạp.
- **Mua điểm ứng tuyển bằng số dư ví** (gói BASIC / STANDARD / PREMIUM — trừ tiền ví, không qua cổng nạp riêng).
- Xem lịch sử nạp tiền và lịch sử mua điểm.

*Không triển khai: **rút tiền từ ví ra tài khoản ngân hàng** (tab “Rút tiền” trên giao diện hiển thị “Coming soon”).*

---

### Use Case của người làm việc tự do (bổ sung)

- **Ứng tuyển** tin đang mở (trừ **1 điểm ứng tuyển** / lần); **rút đơn** khi đơn còn chờ duyệt (điểm đã trừ không hoàn).
- Xem **công việc đang làm** (`GET /api/jobs/my-working-jobs`, thống kê `/my-working-jobs/stats`; giao diện trang `/my-accepted-jobs`).
- **Nộp sản phẩm** (link, ghi chú, file) khi đã được chọn.
- **Xin rút** khỏi công việc đang thực hiện (phí phạt **12%** tiền ký quỹ, trừ ngay vào ví); **duyệt / từ chối / hủy** yêu cầu khi người đăng tuyển xin hủy.
- **Tạo tranh chấp** sau **ít nhất 3 lần** bị yêu cầu chỉnh sửa sản phẩm; **phản hồi tranh chấp** khi người đăng tuyển mở tranh chấp.
- Xem **lịch sử** sự kiện trên tin (`GET /api/jobs/{id}/history`).

---

### Use Case của người đăng tuyển (bổ sung)

- **Đăng ký thêm vai trò** người đăng tuyển (trên tài khoản hiện có).
- **Đăng tin**: nhập thông tin, hệ thống trừ ví **ngân sách + 5% phí**, tin vào trạng thái **chờ quản trị viên duyệt** (`PENDING_APPROVAL`).
- **Sửa tin** khi còn bản nháp và chưa có ứng viên; **đóng tin**; **xóa tin** (theo điều kiện trạng thái); **chuyển trạng thái** bản nháp (API `toggle-status`); **xem tin đã đăng** (`/api/jobs/my-jobs`).
- **Xem danh sách ứng viên**; **chấp nhận** một ứng viên (tin → đang thực hiện, các đơn khác bị từ chối); **từ chối** từng đơn.
- **Duyệt sản phẩm** (chi trả ngân sách từ ký quỹ cho người làm việc tự do); **yêu cầu chỉnh sửa** (`PUT /work/revision`).
- **Xin hủy** công việc đang thực hiện (phí phạt **40%** ký quỹ); **duyệt / từ chối / hủy** yêu cầu khi người làm việc tự do xin rút.
- **Tạo tranh chấp** sau khi người làm việc tự do đã nộp sản phẩm; xem thông tin tranh chấp.
- Xem lịch sử công việc.  
*(Nạp tiền, mua điểm, lịch sử giao dịch: dùng chung mục trên.)*

---

### Use Case của quản trị viên

Giao diện quản trị gồm các mục: **Tổng quan (nạp tiền)**, **Duyệt công việc**, **Tranh chấp**, **Người dùng**, **Thanh toán**.

- Đăng nhập và đăng xuất (cùng cơ chế xác thực JWT).
- **Duyệt** hoặc **từ chối** tin tuyển dụng (từ chối có hoàn tiền ký quỹ cho người đăng tuyển).
- **Quản lý người dùng**: xem danh sách, **khóa / mở** tài khoản (`enabled`).
- **Cấp điểm ứng tuyển** thủ công cho người dùng.
- **Xử lý tranh chấp**: phân xử bên thắng; yêu cầu người làm việc tự do phản hồi bổ sung.
- **Theo dõi giao dịch nạp tiền** và **thống kê nạp tiền** (màn hình tổng quan hiện tập trung số liệu nạp VNPay).

---

### Use Case của hệ thống

- **Quá hạn nộp sản phẩm**: hủy chọn người làm việc tự do, mở lại tin tuyển dụng, cộng điểm không uy tín.
- **Quá hạn duyệt sản phẩm**: tự động duyệt và chuyển ngân sách cho người làm việc tự do.

---

## Ghi chú đối chiếu nhanh (không đưa vào luận văn nếu không cần)

| Nội dung | Thực tế dự án |
|----------|----------------|
| Cổng nạp tiền trên UI | Chỉ **VNPay** (ZaloPay tắt) |
| Rút tiền ra ngân hàng | Chưa có |
| Đăng tin | Trừ ví ngay → **chờ admin** → mới OPEN |
| Điểm ứng tuyển | Trừ khi apply; mua bằng ví; +10/ngày khi login |
| Phạt rút/hủy | FL 12%, EM 40% trên tiền ký quỹ |
| Tranh chấp FL | Cần ≥ 3 lần yêu cầu chỉnh sửa |

---

---

## 2.2.3. Đặc tả Use Case

Xem file **`dac-ta-use-case-theo-quan-ly.md`** (Bảng 2.1 → 2.13).
