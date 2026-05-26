# 2.2. Đặc tả Use Case chi tiết – WorkHub

*Bám mã nguồn dự án WorkHub. Văn bản dùng tên đầy đủ (không viết tắt). Mỗi bảng gồm: Mô tả, Tác nhân, Kích hoạt, Điều kiện trước/sau, Luồng chính, Luồng thay thế, Luồng ngoại lệ, Thông tin khác.*

**Tác nhân:** Freelancer · Employer (Người đăng tuyển) · Quản trị viên · Hệ thống

---

## I. Xác thực và quản lý tài khoản

### Bảng 2.1 – Use Case Đăng ký tài khoản

| | |
|---|---|
| **Mô tả** | Người dùng tạo tài khoản mới trên WorkHub bằng email để tham gia nền tảng (mặc định được gán vai trò Freelancer). |
| **Tác nhân** | Freelancer, Employer (người chưa có tài khoản) |
| **Kích hoạt** | Người dùng chọn **Đăng ký** trên giao diện |
| **Điều kiện trước** | Email chưa tồn tại trong hệ thống; dữ liệu nhập hợp lệ theo form |
| **Điều kiện sau** | Tài khoản lưu trong cơ sở dữ liệu với `emailVerified = false`; OTP đã gửi qua email; hiển thị màn hình nhập OTP |
| **Luồng sự kiện chính** | 1. Người dùng truy cập trang `/register`.<br>2. Nhập email, mật khẩu, họ tên, số điện thoại (tùy chọn).<br>3. Nhấn **Đăng ký**.<br>4. Hệ thống kiểm tra email chưa tồn tại.<br>5. Mã hóa mật khẩu (BCrypt), lưu người dùng, gán vai trò Freelancer.<br>6. Sinh mã OTP, lưu Redis, gửi email.<br>7. Chuyển sang bước xác thực OTP. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Email đã đăng ký → thông báo *"Email đã được đăng ký"*.<br>4b. Dữ liệu không hợp lệ → hiển thị lỗi từng trường.<br>6a. Lỗi gửi mail → thông báo thử lại / gửi lại OTP sau. |
| **Thông tin khác** | API: `POST /api/auth/register` |

---

### Bảng 2.2 – Use Case Xác thực OTP (đăng ký)

| | |
|---|---|
| **Mô tả** | Xác minh email bằng mã OTP sau đăng ký. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Người dùng nhập OTP hoặc chọn **Gửi lại OTP** |
| **Điều kiện trước** | Đã đăng ký; OTP còn TTL trong Redis |
| **Điều kiện sau** | Email đã xác thực; JWT + refresh token trong cookie; vào trang chủ |
| **Luồng sự kiện chính** | 1. Người dùng nhập mã OTP 6 số.<br>2. Nhấn **Xác thực**.<br>3. Hệ thống đối chiếu OTP (loại REGISTRATION).<br>4. Cập nhật `emailVerified = true`.<br>5. Tạo phiên đăng nhập, chuyển trang chủ. |
| **Luồng sự kiện thay thế** | 1a. Chọn **Gửi lại OTP** → kiểm tra cooldown → gửi mã mới → thông báo *"Đã gửi lại OTP"*. |
| **Luồng ngoại lệ** | 3a. OTP sai → *"Mã OTP không đúng"*.<br>3b. OTP hết hạn → yêu cầu gửi lại.<br>3c. Vượt `OTP_MAX_ATTEMPTS` → tạm khóa theo rate limit. |
| **Thông tin khác** | API: `POST /api/auth/verify-otp`, `POST /api/auth/resend-otp` |

---

### Bảng 2.3 – Use Case Đăng nhập

| | |
|---|---|
| **Mô tả** | Tác nhân đăng nhập để sử dụng dịch vụ theo vai trò. |
| **Tác nhân** | Freelancer, Employer, Quản trị viên |
| **Kích hoạt** | Tác nhân muốn đăng nhập |
| **Điều kiện trước** | Tài khoản tồn tại; email đã xác thực (đăng nhập email); tài khoản `enabled = true` |
| **Điều kiện sau** | Đăng nhập thành công; cookie JWT; chuyển trang chủ (Quản trị viên → `/admin` nếu có vai trò quản trị) |
| **Luồng sự kiện chính** | 1. Truy cập `/login`.<br>2. Chọn đăng nhập bằng **email**.<br>3. Nhập email, mật khẩu, nhấn **Đăng nhập**.<br>4. Hệ thống xác thực qua Spring Security.<br>5. Cộng **10 điểm ứng tuyển**/ngày nếu chưa nhận (`claimDailyCredits`).<br>6. Trả JWT, set cookie, chuyển trang chủ. |
| **Luồng sự kiện thay thế** | 2a. Chọn **Đăng nhập Google**.<br>3a. Xác thực với Google OAuth.<br>4a. Lấy email, tên, avatar từ Google.<br>5a. Tạo user mới (Freelancer) nếu chưa có; tự `verifyEmail`.<br>6a. Cộng điểm hàng ngày (nếu đủ điều kiện) → trang chủ. |
| **Luồng ngoại lệ** | 4b. Sai email/mật khẩu → *"Email hoặc mật khẩu không đúng"*.<br>4c. Email chưa xác thực → gửi OTP mới, ném `EmailNotVerifiedException`.<br>4d. Tài khoản bị khóa → từ chối truy cập.<br>4e. Google token lỗi → *"Xác thực Google thất bại"*. |
| **Thông tin khác** | API: `POST /api/auth/login`, `POST /api/auth/google` |

---

### Bảng 2.4 – Use Case Đăng xuất

| | |
|---|---|
| **Mô tả** | Kết thúc phiên làm việc an toàn. |
| **Tác nhân** | Freelancer, Employer, Quản trị viên |
| **Kích hoạt** | Chọn **Đăng xuất** |
| **Điều kiện trước** | Đang đăng nhập |
| **Điều kiện sau** | Refresh token xóa khỏi cơ sở dữ liệu; SecurityContext clear; về trang công khai |
| **Luồng sự kiện chính** | 1. Người dùng chọn Đăng xuất.<br>2. Client gọi `POST /api/auth/logout` kèm cookie refreshToken.<br>3. Server xóa refresh token.<br>4. Xóa cookie phía client.<br>5. Chuyển `/login` hoặc trang chủ. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Không có refresh token → vẫn xóa phiên phía client. |
| **Thông tin khác** | — |

---

### Bảng 2.5 – Use Case Quên mật khẩu

| | |
|---|---|
| **Mô tả** | Khởi tạo quy trình lấy lại mật khẩu qua OTP email. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Chọn **Quên mật khẩu** tại trang đăng nhập |
| **Điều kiện trước** | Email tồn tại trong hệ thống |
| **Điều kiện sau** | OTP loại FORGOT_PASSWORD đã gửi; chuyển màn hình đặt lại mật khẩu |
| **Luồng sự kiện chính** | 1. Truy cập `/forgot-password`.<br>2. Nhập email đã đăng ký.<br>3. Nhấn gửi yêu cầu.<br>4. Hệ thống tìm người dùng, sinh OTP, gửi email.<br>5. Hiển thị biểu mẫu nhập OTP và mật khẩu mới. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Email không tồn tại → có thể báo chung *"Nếu email tồn tại, OTP đã được gửi"* (bảo mật) hoặc báo lỗi theo triển khai hiện tại. |
| **Thông tin khác** | API: `POST /api/auth/forgot-password` |

---

### Bảng 2.6 – Use Case Đặt lại mật khẩu

| | |
|---|---|
| **Mô tả** | Đặt mật khẩu mới sau khi xác thực OTP quên mật khẩu. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Người dùng hoàn tất form reset |
| **Điều kiện trước** | OTP FORGOT_PASSWORD hợp lệ |
| **Điều kiện sau** | Mật khẩu mới lưu; mọi refresh token cũ bị xóa |
| **Luồng sự kiện chính** | 1. Nhập email, OTP, mật khẩu mới, xác nhận mật khẩu.<br>2. Nhấn **Đặt lại mật khẩu**.<br>3. Hệ thống xác minh OTP.<br>4. Mã hóa và lưu mật khẩu mới.<br>5. Xóa toàn bộ refresh token của người dùng.<br>6. Thông báo thành công → chuyển trang đăng nhập. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. OTP sai hoặc hết hạn → lỗi tương tự đăng ký.<br>4a. Mật khẩu không đạt quy tắc → báo lỗi kiểm tra dữ liệu. |
| **Thông tin khác** | API: `POST /api/auth/reset-password` |

---

### Bảng 2.7 – Use Case Đổi mật khẩu

| | |
|---|---|
| **Mô tả** | Đổi mật khẩu khi đã đăng nhập. |
| **Tác nhân** | Freelancer, Employer, Quản trị viên |
| **Kích hoạt** | Chọn đổi mật khẩu trong hồ sơ/cài đặt |
| **Điều kiện trước** | Đã đăng nhập; mật khẩu hiện tại đúng |
| **Điều kiện sau** | Mật khẩu mới có hiệu lực |
| **Luồng sự kiện chính** | 1. Mở form đổi mật khẩu.<br>2. Nhập mật khẩu cũ, mật khẩu mới, xác nhận mật khẩu.<br>3. Gửi `PUT /api/users/me/password`.<br>4. Máy chủ kiểm tra mật khẩu cũ.<br>5. Lưu mật khẩu mới, thông báo thành công. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Mật khẩu cũ sai → từ chối.<br>4b. Mật khẩu mới trùng mật khẩu cũ hoặc quá yếu → báo lỗi kiểm tra dữ liệu. |
| **Thông tin khác** | — |

---

### Bảng 2.8 – Use Case Cập nhật hồ sơ cá nhân

| | |
|---|---|
| **Mô tả** | Cập nhật thông tin hiển thị và nghiệp vụ trên hồ sơ. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Chọn **Lưu** sau chỉnh sửa tại `/profile` |
| **Điều kiện trước** | Đã đăng nhập |
| **Điều kiện sau** | Dữ liệu hồ sơ cập nhật trong cơ sở dữ liệu |
| **Luồng sự kiện chính** | 1. Mở trang hồ sơ.<br>2. Sửa: họ tên, tiểu sử, kỹ năng, số điện thoại, đường dẫn ảnh đại diện, đường dẫn ảnh bìa, thông tin ngân hàng (đối với Freelancer), cờ *sẵn sàng nhận việc*.<br>3. (Tùy chọn) Tải ảnh đại diện hoặc ảnh bìa theo Use Case Tải tệp đính kèm.<br>4. Nhấn Lưu → `PUT /api/users/me`.<br>5. Hiển thị thông báo cập nhật thành công. |
| **Luồng sự kiện thay thế** | 3a. Upload ảnh trước → lấy URL → điền vào form → lưu hồ sơ. |
| **Luồng ngoại lệ** | 4a. Dữ liệu không hợp lệ → lỗi validation.<br>4b. Không có quyền → 401/403. |
| **Thông tin khác** | Trust/Untrust score chỉ thay đổi qua nghiệp vụ job, không sửa trực tiếp tại form. |

---

### Bảng 2.9 – Use Case Đăng ký vai trò Employer

| | |
|---|---|
| **Mô tả** | Người dùng thêm quyền đăng tin tuyển dụng. |
| **Tác nhân** | Freelancer (đã có tài khoản) |
| **Kích hoạt** | Chọn **Trở thành người đăng tuyển** |
| **Điều kiện trước** | Đã đăng nhập; chưa có `ROLE_EMPLOYER` |
| **Điều kiện sau** | Tài khoản có thêm role Employer; có thể đăng job |
| **Luồng sự kiện chính** | 1. Người dùng chọn đăng ký Employer.<br>2. Gọi `POST /api/users/me/become-employer`.<br>3. Hệ thống gán role.<br>4. Thông báo thành công; hiển thị menu đăng việc. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Đã là Employer → thông báo đã có quyền. |
| **Thông tin khác** | — |

---

### Bảng 2.10 – Use Case Tải tệp đính kèm

| | |
|---|---|
| **Mô tả** | Upload ảnh/tài liệu lên Cloudinary phục vụ avatar, nộp bài, chat, tranh chấp. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Chọn file và usage (AVATAR, COVER, JOB_WORK, CHAT, DISPUTE…) |
| **Điều kiện trước** | Đã đăng nhập; file đúng định dạng/kích thước |
| **Điều kiện sau** | Bản ghi FileUpload + URL Cloudinary; có thể `assign` vào thự thể |
| **Luồng sự kiện chính** | 1. Chọn file trên giao diện.<br>2. Client gọi `POST /api/files/image` hoặc `/document`.<br>3. Server upload Cloudinary.<br>4. Trả `fileId`, URL.<br>5. Khi nộp bài/chat/dispute: gọi assign hoặc gửi kèm fileId. |
| **Luồng sự kiện thay thế** | 2a. Upload chung `POST /api/files` tùy loại file. |
| **Luồng ngoại lệ** | 3a. File quá lớn → lỗi.<br>3b. Sai định dạng → lỗi.<br>3c. Lỗi Cloudinary → thông báo thử lại. |
| **Thông tin khác** | Ảnh avatar giới hạn ~200KB theo API image |

---

### Bảng 2.11 – Use Case Tra cứu danh sách Freelancer

| | |
|---|---|
| **Mô tả** | Xem danh sách Freelancer công khai (phân trang). |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Truy cập `/freelancers` |
| **Điều kiện trước** | Không bắt buộc đăng nhập (API public) |
| **Điều kiện sau** | Hiển thị danh sách Freelancer kèm điểm uy tín, trạng thái quan hệ (nếu đã đăng nhập) |
| **Luồng sự kiện chính** | 1. Mở trang danh sách Freelancer.<br>2. Gọi `GET /api/users/freelancers?page&size&sort`.<br>3. Hiển thị thẻ hồ sơ.<br>4. (Nếu đã đăng nhập) hiển thị trạng thái kết nối: chưa kết nối / đang chờ / đã chấp nhận. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Lỗi mạng → thông báo tải lại. |
| **Thông tin khác** | Quản trị viên không xuất hiện trong danh sách |

---

**Đặc tả đầy đủ 59 UC (3 phần):**

| File | Bảng |
|------|------|
| `dac-ta-use-case-chi-tiet.md` (file này) | 2.1 – 2.11 |
| `dac-ta-use-case-chi-tiet-phan-2.md` | 2.12 – 2.27 |
| `dac-ta-use-case-chi-tiet-phan-3.md` | 2.28 – 2.59 |

*Bản rút gọn (không khuyến nghị cho luận văn): `dac-ta-use-case-day-du.md`.*
