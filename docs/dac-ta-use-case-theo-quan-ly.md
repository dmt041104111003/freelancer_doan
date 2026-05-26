# 2.2.3. Đặc tả Use Case theo nhóm quản lý – WorkHub

*Bám mục 2.2 (`muc-2-2-tac-nhan-va-use-case.md`) và mã nguồn thực tế. Mỗi bảng = một nhóm chức năng quản lý, không tách từng thao tác lẻ.*

---

### Bảng 2.1 – Use Case Quản lý tài khoản

| | |
|---|---|
| **Mô tả** | Đăng ký, xác thực, đăng nhập và quản lý thông tin cá nhân trên WorkHub. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển, Quản trị viên (đăng nhập) |
| **Kích hoạt** | Người dùng truy cập các chức năng tài khoản trên giao diện |
| **Điều kiện trước** | Tuỳ thao tác: chưa có tài khoản (đăng ký) hoặc đã có tài khoản hợp lệ (các thao tác khác) |
| **Điều kiện sau** | Tài khoản được tạo/xác thực/cập nhật; phiên đăng nhập hợp lệ (JWT, cookie) khi đăng nhập thành công |
| **Luồng sự kiện chính** | **Đăng ký:** nhập email, mật khẩu, họ tên → hệ thống lưu tài khoản (vai trò người làm việc tự do mặc định) → gửi OTP email.<br>**Xác thực:** nhập OTP → kích hoạt email → vào hệ thống.<br>**Đăng nhập:** email/mật khẩu hoặc Google → cộng 10 điểm ứng tuyển/ngày (nếu chưa nhận) → vào trang chủ.<br>**Khôi phục mật khẩu:** quên mật khẩu → OTP → đặt mật khẩu mới.<br>**Hồ sơ / đổi mật khẩu:** chỉnh sửa thông tin hoặc mật khẩu khi đã đăng nhập.<br>**Đăng xuất:** xóa phiên, cookie. |
| **Luồng sự kiện thay thế** | Đăng nhập Google: tạo hoặc liên kết tài khoản, tự xác thực email.<br>Người làm việc tự do: đăng ký thêm vai trò người đăng tuyển (`become-employer`). |
| **Luồng ngoại lệ** | Email trùng, OTP sai/hết hạn, sai mật khẩu, tài khoản bị khóa, email chưa xác thực. |
| **Thông tin khác** | API: `/api/auth/*`, `/api/users/me`, `/api/users/me/password`, `/api/users/me/become-employer` |

---

### Bảng 2.2 – Use Case Tải tệp đính kèm

| | |
|---|---|
| **Mô tả** | Upload ảnh/tài liệu lên Cloudinary phục vụ hồ sơ, nộp bài, chat, tranh chấp. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển |
| **Kích hoạt** | Chọn tệp trên giao diện (hồ sơ, nộp sản phẩm, chat, tranh chấp) |
| **Điều kiện trước** | Đã đăng nhập; tệp đúng định dạng và dung lượng |
| **Điều kiện sau** | Có mã tệp và đường dẫn; gắn được vào hồ sơ/bài nộp/tin nhắn/tranh chấp |
| **Luồng sự kiện chính** | 1. Chọn tệp. 2. Gọi API upload (`/api/files/image` hoặc `/document`). 3. Lưu Cloudinary, trả mã tệp. 4. Dùng mã tệp trong thao tác nghiệp vụ tiếp theo. |
| **Luồng sự kiện thay thế** | Gán tệp vào đối tượng qua API assign. |
| **Luồng ngoại lệ** | Tệp quá lớn, sai định dạng, lỗi Cloudinary. |
| **Thông tin khác** | — |

---

### Bảng 2.3 – Use Case Tra cứu thông tin

| | |
|---|---|
| **Mô tả** | Tra cứu tin công việc đang mở và danh sách người làm việc tự do; lưu tin quan tâm. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển (xem công khai không bắt buộc đăng nhập) |
| **Kích hoạt** | Truy cập trang việc làm, tìm kiếm, hoặc trang danh sách Freelancer |
| **Điều kiện trước** | Tra cứu công khai: không cần đăng nhập; lưu tin: cần đăng nhập |
| **Điều kiện sau** | Hiển thị kết quả phân trang; trạng thái đã lưu (nếu đăng nhập) |
| **Luồng sự kiện chính** | 1. Mở danh sách tin (`GET /api/jobs`) hoặc chi tiết (`/jobs/{id}`). 2. (Tuỳ chọn) tìm kiếm, lọc kỹ năng. 3. (Đã login) bật/tắt lưu tin. 4. Mở danh sách người làm việc tự do (`/api/users/freelancers`). |
| **Luồng sự kiện thay thế** | Kết hợp tìm kiếm và lọc trên giao diện. |
| **Luồng ngoại lệ** | Không có kết quả; tin không tồn tại; chưa đăng nhập khi lưu tin. |
| **Thông tin khác** | API công khai: jobs, search, by-skills, freelancers |

---

### Bảng 2.4 – Use Case Trao đổi và thông báo

| | |
|---|---|
| **Mô tả** | Kết nối hai người dùng, chat một-một realtime, quản lý thông báo hệ thống. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển |
| **Kích hoạt** | Gửi lời mời kết nối, mở chat, mở chuông thông báo |
| **Điều kiện trước** | Đã đăng nhập; chat: đã chấp nhận kết nối, không bị chặn |
| **Điều kiện sau** | Tin nhắn/thông báo được lưu; đối phương nhận qua WebSocket (nếu online) |
| **Luồng sự kiện chính** | **Kết nối:** gửi yêu cầu → bên kia chấp nhận/từ chối hoặc người gửi hủy.<br>**Chat:** mở hội thoại → gửi/nhận tin (REST hoặc STOMP) → đánh dấu đã đọc; có thể chặn hội thoại.<br>**Thông báo:** xem danh sách → đánh dấu đã đọc một hoặc tất cả. |
| **Luồng sự kiện thay thế** | Gửi tin kèm tệp đã upload. |
| **Luồng ngoại lệ** | Chưa kết nối, bị chặn, trùng yêu cầu kết nối. |
| **Thông tin khác** | API: `/api/chat/*`, `/api/notifications/*` |

---

### Bảng 2.5 – Use Case Quản lý tài chính

| | |
|---|---|
| **Mô tả** | Nạp tiền ví (VNPay), mua điểm ứng tuyển bằng số dư, xem lịch sử giao dịch. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển |
| **Kích hoạt** | Mở trang ví (`/wallet`) |
| **Điều kiện trước** | Đã đăng nhập; nạp ≥ 10.000 đồng; mua điểm: đủ số dư ví |
| **Điều kiện sau** | Ví hoặc điểm ứng tuyển cập nhật; giao dịch ghi nhận |
| **Luồng sự kiện chính** | **Nạp:** nhập số tiền → tạo đơn VNPay → thanh toán → IPN/return xác nhận → cộng ví.<br>**Mua điểm:** chọn gói (BASIC/STANDARD/PREMIUM) → trừ ví → cộng điểm.<br>**Lịch sử:** xem danh sách nạp tiền và mua điểm. |
| **Luồng sự kiện thay thế** | Kiểm tra lại trạng thái nạp sau khi quay về từ VNPay. |
| **Luồng ngoại lệ** | Số tiền không hợp lệ, thanh toán hủy, không đủ số dư khi mua điểm. |
| **Thông tin khác** | Giao diện chỉ bật **VNPay**; rút tiền ra ngân hàng **chưa** triển khai |

---

### Bảng 2.6 – Use Case Quản lý tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Người đăng tuyển tạo và quản lý tin; hệ thống giữ tiền ký quỹ; tin chờ quản trị viên duyệt trước khi mở. |
| **Tác nhân** | Người đăng tuyển |
| **Kích hoạt** | Đăng tin, sửa, đóng, xóa hoặc xem tin đã đăng |
| **Điều kiện trước** | Có vai trò người đăng tuyển; đăng tin: ví ≥ ngân sách + 5% phí |
| **Điều kiện sau** | Tin lưu với trạng thái tương ứng; tiền ký quỹ trừ khi đăng tin chờ duyệt |
| **Luồng sự kiện chính** | 1. Nhập thông tin tin (ngân sách, hạn ứng tuyển, ngày nộp/duyệt, kỹ năng…). 2. Hệ thống trừ ví (ngân sách + 5% phí). 3. Tin ở trạng thái chờ duyệt. 4. Sau khi quản trị viên duyệt → tin mở, nhận ứng tuyển. 5. Quản lý: sửa (bản nháp), đóng, xóa, xem danh sách tin của mình. |
| **Luồng sự kiện thay thế** | Chuyển trạng thái bản nháp (`toggle-status`) nếu dùng nháp. |
| **Luồng ngoại lệ** | Không đủ số dư; không sửa được khi đã có ứng viên; quản trị viên từ chối → hoàn ký quỹ. |
| **Thông tin khác** | API: `POST/PUT/PATCH/DELETE /api/jobs`, `my-jobs` |

---

### Bảng 2.7 – Use Case Quản lý ứng tuyển

| | |
|---|---|
| **Mô tả** | Người làm việc tự do ứng tuyển hoặc rút đơn; người đăng tuyển xem và quyết định ứng viên. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển |
| **Kích hoạt** | Ứng tuyển / rút đơn / duyệt ứng viên trên tin đang mở |
| **Điều kiện trước** | Tin đang mở; ứng tuyển: ≥ 1 điểm ứng tuyển, không phải chủ tin |
| **Điều kiện sau** | Đơn ứng tuyển cập nhật; chấp nhận một người → tin chuyển đang thực hiện |
| **Luồng sự kiện chính** | **Người làm việc tự do:** nộp đơn (trừ 1 điểm) hoặc rút đơn khi còn chờ.<br>**Người đăng tuyển:** xem danh sách ứng viên → chấp nhận một người (các đơn khác từ chối) hoặc từ chối từng đơn. |
| **Luồng sự kiện thay thế** | Ứng tuyển lại sau khi đã rút đơn trước đó. |
| **Luồng ngoại lệ** | Không đủ điểm; trùng đơn; tin không còn mở. |
| **Thông tin khác** | Điểm đã trừ khi ứng tuyển **không** hoàn khi rút đơn |

---

### Bảng 2.8 – Use Case Quản lý thực hiện công việc

| | |
|---|---|
| **Mô tả** | Thực hiện tin đã được chọn: nộp sản phẩm, duyệt hoặc yêu cầu chỉnh sửa. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển |
| **Kích hoạt** | Nộp bài / duyệt bài / yêu cầu sửa trên tin đang thực hiện |
| **Điều kiện trước** | Tin đang thực hiện; có ứng viên đã được chấp nhận |
| **Điều kiện sau** | Duyệt: tin hoàn thành, chuyển ngân sách cho người làm việc tự do; chỉnh sửa: hạn nộp lại |
| **Luồng sự kiện chính** | 1. Người làm việc tự do xem việc đang làm (`my-working-jobs`). 2. Nộp sản phẩm (link, ghi chú, tệp). 3. Người đăng tuyển duyệt → hoàn thành, chi trả ngân sách; hoặc yêu cầu chỉnh sửa → người làm việc tự do nộp lại. |
| **Luồng sự kiện thay thế** | Nhiều lần chỉnh sửa (ghi lịch sử). |
| **Luồng ngoại lệ** | Quá hạn nộp/duyệt → xử lý bởi hệ thống (Bảng 2.12); tranh chấp → Bảng 2.10. |
| **Thông tin khác** | API: `/work/submit`, `/work/approve`, `/work/revision` |

---

### Bảng 2.9 – Use Case Quản lý rút / hủy công việc

| | |
|---|---|
| **Mô tả** | Một bên xin rút hoặc hủy khi tin đang thực hiện; bên kia duyệt hoặc từ chối; có phí phạt. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển |
| **Kích hoạt** | Gửi hoặc xử lý yêu cầu rút/hủy trên tin đang thực hiện |
| **Điều kiện trước** | Tin đang thực hiện; người gửi đủ tiền phạt (12% hoặc 40% ký quỹ) trong ví |
| **Điều kiện sau** | Duyệt: tin hủy, hoàn ký quỹ cho người đăng tuyển; từ chối: tin tiếp tục |
| **Luồng sự kiện chính** | 1. Bên chủ động gửi yêu cầu (kèm lý do), hệ thống trừ phí phạt ngay.<br>2. Bên còn lại duyệt → hủy tin, hoàn ký quỹ; hoặc từ chối; hoặc người gửi hủy yêu cầu.<br>3. Thông báo hai bên. |
| **Luồng sự kiện thay thế** | — |
| **Luồng ngoại lệ** | Không đủ phí phạt; đã có yêu cầu đang chờ. |
| **Thông tin khác** | Phạt: người làm việc tự do **12%**, người đăng tuyển **40%** tiền ký quỹ; phí không hoàn khi bị từ chối |

---

### Bảng 2.10 – Use Case Quản lý tranh chấp

| | |
|---|---|
| **Mô tả** | Giải quyết bất đồng trong quá trình thực hiện tin; quản trị viên phân xử. |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển, Quản trị viên |
| **Kích hoạt** | Tạo tranh chấp hoặc xử lý hồ sơ tranh chấp |
| **Điều kiện trước** | **Người đăng tuyển:** đã có bài nộp.<br>**Người làm việc tự do:** ≥ 3 lần bị yêu cầu chỉnh sửa.<br>**Quản trị viên:** có hồ sơ chờ xử lý |
| **Điều kiện sau** | Tranh chấp đóng; phân chia tiền ký quỹ theo quyết định quản trị viên |
| **Luồng sự kiện chính** | 1. Người đăng tuyển hoặc người làm việc tự do tạo tranh chấp (mô tả, bằng chứng). 2. Người làm việc tự do phản hồi (nếu do người đăng tuyển mở). 3. Quản trị viên xem hồ sơ → (tuỳ chọn) yêu cầu phản hồi thêm → phân xử bên thắng. 4. Thông báo kết quả. |
| **Luồng sự kiện thay thế** | Người làm việc tự do tạo tranh chấp → chờ quản trị viên, không bắt buộc phản hồi người đăng tuyển trước. |
| **Luồng ngoại lệ** | Chưa đủ điều kiện tạo; trùng tranh chấp đang mở. |
| **Thông tin khác** | API: `/api/jobs/{id}/disputes`, `/api/admin/disputes/*` |

---

### Bảng 2.11 – Use Case Xem lịch sử công việc

| | |
|---|---|
| **Mô tả** | Xem dòng thời gian các sự kiện trên một tin (đăng, duyệt, nộp bài, tranh chấp…). |
| **Tác nhân** | Người làm việc tự do, Người đăng tuyển, Quản trị viên |
| **Kích hoạt** | Mở tab lịch sử tại chi tiết tin |
| **Điều kiện trước** | Có quyền xem tin |
| **Điều kiện sau** | Hiển thị danh sách sự kiện theo thời gian |
| **Luồng sự kiện chính** | 1. Mở chi tiết tin. 2. Gọi `GET /api/jobs/{id}/history`. 3. Hiển thị hành động, mô tả, thời gian. |
| **Luồng sự kiện thay thế** | Phân trang (`history/paged`). |
| **Luồng ngoại lệ** | Tin không tồn tại. |
| **Thông tin khác** | Dùng đếm số lần chỉnh sửa cho điều kiện tranh chấp |

---

### Bảng 2.12 – Use Case Quản trị hệ thống

| | |
|---|---|
| **Mô tả** | Quản trị viên vận hành: duyệt tin, quản lý người dùng, tranh chấp, theo dõi nạp tiền. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Truy cập khu vực `/admin` |
| **Điều kiện trước** | Đăng nhập với vai trò quản trị |
| **Điều kiện sau** | Thao tác được ghi nhận; trạng thái tin/người dùng/tranh chấp cập nhật |
| **Luồng sự kiện chính** | 1. **Duyệt tin:** xem tin chờ → duyệt (mở tin) hoặc từ chối (hoàn ký quỹ).<br>2. **Người dùng:** xem danh sách → khóa/mở tài khoản; cấp điểm ứng tuyển.<br>3. **Tranh chấp:** xem hồ sơ → phân xử hoặc yêu cầu phản hồi.<br>4. **Thanh toán:** xem thống kê và danh sách giao dịch nạp VNPay. |
| **Luồng sự kiện thay thế** | — |
| **Luồng ngoại lệ** | Tin không còn trạng thái chờ duyệt; thiếu lý do từ chối. |
| **Thông tin khác** | Màn tổng quan hiện tập trung **thống kê nạp tiền** |

---

### Bảng 2.13 – Use Case Xử lý quá hạn (hệ thống)

| | |
|---|---|
| **Mô tả** | Tiến trình nền tự xử lý khi quá hạn nộp hoặc quá hạn duyệt sản phẩm. |
| **Tác nhân** | Hệ thống |
| **Kích hoạt** | Chạy định kỳ (khoảng 5 phút) |
| **Điều kiện trước** | Tin đang thực hiện; đã qua hạn nộp hoặc hạn duyệt |
| **Điều kiện sau** | **Quá hạn nộp:** bỏ chọn người làm việc tự do, mở lại tin.<br>**Quá hạn duyệt:** tự duyệt, chi trả ngân sách |
| **Luồng sự kiện chính** | 1. Quét tin quá hạn. 2. Nếu chưa nộp → hủy chọn, mở tin, cộng điểm không uy tín.<br>3. Nếu đã nộp, chưa duyệt → tự duyệt, hoàn thành tin, chuyển tiền.<br>4. Ghi lịch sử và thông báo. |
| **Luồng sự kiện thay thế** | Bỏ qua nếu đã nộp (nhánh nộp) hoặc đã duyệt (nhánh duyệt). |
| **Luồng ngoại lệ** | Không tìm thấy đơn được chấp nhận → ghi log, bỏ qua. |
| **Thông tin khác** | `JobSchedulerService` |

---

## Bảng tổng hợp (ánh xạ mục 2.2.2)

| STT | Nhóm quản lý | Bảng | Tác nhân chính |
|-----|----------------|------|----------------|
| 1 | Quản lý tài khoản | 2.1 | Chung |
| 2 | Tải tệp | 2.2 | Chung |
| 3 | Tra cứu | 2.3 | Chung |
| 4 | Trao đổi & thông báo | 2.4 | Chung |
| 5 | Tài chính | 2.5 | Chung |
| 6 | Tin tuyển dụng | 2.6 | Người đăng tuyển |
| 7 | Ứng tuyển | 2.7 | Hai bên |
| 8 | Thực hiện công việc | 2.8 | Hai bên |
| 9 | Rút / hủy | 2.9 | Hai bên |
| 10 | Tranh chấp | 2.10 | Hai bên + Quản trị |
| 11 | Lịch sử công việc | 2.11 | Hai bên + Quản trị |
| 12 | Quản trị hệ thống | 2.12 | Quản trị viên |
| 13 | Xử lý quá hạn | 2.13 | Hệ thống |

*Tổng **13** đặc tả Use Case cấp quản lý (thay cho 59 bảng chi tiết). Chi tiết từng API/luồng lẻ: tham khảo `dac-ta-use-case-chi-tiet*.md` nếu cần phụ lục.*
