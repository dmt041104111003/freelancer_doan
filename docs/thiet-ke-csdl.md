# Thiết kế cơ sở dữ liệu

## 2.3.1. Các bảng cơ sở dữ liệu chính

**Bảng 2. 14. Các bảng trong cơ sở dữ liệu**

| STT | Tên bảng | Giải thích |
|-----|----------|------------|
| 1 | Users | Bảng người dùng |
| 2 | Roles | Bảng vai trò hệ thống |
| 3 | User_roles | Bảng phân quyền người dùng |
| 4 | Jobs | Bảng tin tuyển dụng |
| 5 | Job_applications | Bảng đơn ứng tuyển |
| 6 | Job_histories | Bảng lịch sử công việc |
| 7 | Saved_jobs | Bảng tin đã lưu |
| 8 | Disputes | Bảng tranh chấp |
| 9 | Withdrawal_requests | Bảng yêu cầu rút / hủy công việc |
| 10 | Balance_deposits | Bảng nạp số dư ví |
| 11 | Credit_purchases | Bảng mua điểm ứng tuyển |
| 12 | Conversations | Bảng cuộc hội thoại (kết nối chat) |
| 13 | Messages | Bảng tin nhắn |
| 14 | File_uploads | Bảng tệp đính kèm (ảnh / tài liệu) |
| 15 | Notifications | Bảng thông báo |
| 16 | Refresh_tokens | Bảng refresh token đăng nhập |

*Mỗi bảng ở mục 2.3.1 tương ứng một bảng thiết kế chi tiết (Bảng 2. 15 → 2. 30).*

---

## 2.3.2. Thiết kế các bảng trong cơ sở dữ liệu

### · Bảng Users (người dùng)

**Bảng 2. 15. Bảng Users**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | email | varchar(255) | Not null | Email đăng nhập (duy nhất) |
| 3 | password | varchar(255) | Not null | Mật khẩu |
| 4 | full_name | varchar(255) | Not null | Họ và tên |
| 5 | phone_number | varchar(20) | Null | Số điện thoại |
| 6 | avatar_url | varchar(500) | Null | Ảnh đại diện |
| 7 | cover_image_url | varchar(500) | Null | Ảnh bìa |
| 8 | title | varchar(200) | Null | Chức danh |
| 9 | bio | varchar(255) | Null | Tiểu sử |
| 10 | credits | int | Not null | Điểm ứng tuyển |
| 11 | balance | decimal(15,2) | Not null | Số dư ví |
| 12 | email_verified | tinyint(1) | Not null | Đã xác thực email |
| 13 | enabled | tinyint(1) | Not null | Trạng thái hoạt động |
| 14 | is_verified | tinyint(1) | Not null | Tài khoản xác minh |
| 15 | is_open_to_work | tinyint(1) | Not null | Sẵn sàng nhận việc |
| 16 | trust_score | int | Not null | Điểm uy tín |
| 17 | untrust_score | int | Not null | Điểm không uy tín |
| 18 | last_daily_credit_date | date | Null | Ngày nhận điểm đăng nhập |
| 19 | created_at | datetime | Not null | Ngày tạo tài khoản |
| 20 | updated_at | datetime | Null | Ngày cập nhật |

---

### · Bảng Roles (vai trò)

**Bảng 2. 16. Bảng Roles**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | name | enum | Not null | Tên vai trò (Freelancer, Employer, Admin) |

---

### · Bảng User_roles (phân quyền)

**Bảng 2. 17. Bảng User_roles**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | user_id | int | Not null | Khóa ngoại người dùng |
| 2 | role_id | int | Not null | Khóa ngoại vai trò |

---

### · Bảng Jobs (tin tuyển dụng)

**Bảng 2. 18. Bảng Jobs**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | employer_id | int | Not null | Khóa ngoại người đăng tuyển |
| 3 | title | varchar(255) | Not null | Tiêu đề công việc |
| 4 | description | text | Not null | Mô tả công việc |
| 5 | budget | decimal(15,2) | Null | Ngân sách |
| 6 | escrow_amount | decimal(15,2) | Null | Tiền giữ ký quỹ |
| 7 | currency | varchar(10) | Null | Loại tiền (VND) |
| 8 | complexity | enum | Not null | Độ khó công việc |
| 9 | duration | enum | Not null | Thời hạn dự án |
| 10 | work_type | enum | Not null | Hình thức làm việc |
| 11 | status | enum | Not null | Trạng thái tin (nháp, chờ duyệt, mở, …) |
| 12 | application_deadline | datetime | Null | Hạn nộp hồ sơ |
| 13 | submission_days | int | Null | Số ngày nộp sản phẩm |
| 14 | review_days | int | Null | Số ngày duyệt sản phẩm |
| 15 | view_count | int | Not null | Lượt xem |
| 16 | application_count | int | Not null | Số đơn ứng tuyển |
| 17 | created_at | datetime | Not null | Ngày tạo tin |
| 18 | updated_at | datetime | Null | Ngày cập nhật |

---

### · Bảng Job_applications (ứng tuyển)

**Bảng 2. 19. Bảng Job_applications**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | job_id | int | Not null | Khóa ngoại tin tuyển dụng |
| 3 | freelancer_id | int | Not null | Khóa ngoại người ứng tuyển |
| 4 | cover_letter | text | Null | Thư giới thiệu |
| 5 | status | enum | Not null | Trạng thái đơn (chờ, chấp nhận, từ chối, rút) |
| 6 | work_status | enum | Null | Trạng thái nộp sản phẩm |
| 7 | work_submission_url | varchar(255) | Null | Link sản phẩm |
| 8 | work_submission_note | text | Null | Ghi chú khi nộp |
| 9 | work_submitted_at | datetime | Null | Ngày nộp sản phẩm |
| 10 | created_at | datetime | Not null | Ngày ứng tuyển |
| 11 | updated_at | datetime | Null | Ngày cập nhật |

---

### · Bảng Job_histories (lịch sử công việc)

**Bảng 2. 20. Bảng Job_histories**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | job_id | int | Not null | Khóa ngoại công việc |
| 3 | user_id | int | Not null | Khóa ngoại người thực hiện |
| 4 | action | enum | Not null | Loại sự kiện |
| 5 | description | text | Null | Mô tả sự kiện |
| 6 | metadata | text | Null | Dữ liệu bổ sung |
| 7 | created_at | datetime | Not null | Thời điểm ghi nhận |

---

### · Bảng Saved_jobs (tin đã lưu)

**Bảng 2. 21. Bảng Saved_jobs**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | job_id | int | Not null | Khóa ngoại tin tuyển dụng |
| 3 | user_id | int | Not null | Khóa ngoại người dùng |
| 4 | created_at | datetime | Not null | Ngày lưu tin |

---

### · Bảng Disputes (tranh chấp)

**Bảng 2. 22. Bảng Disputes**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | job_id | int | Not null | Khóa ngoại công việc |
| 3 | employer_id | int | Not null | Người đăng tuyển |
| 4 | freelancer_id | int | Not null | Người làm việc tự do |
| 5 | employer_description | text | Not null | Nội dung khiếu nại |
| 6 | freelancer_description | text | Null | Nội dung phản hồi |
| 7 | status | enum | Not null | Trạng thái tranh chấp |
| 8 | admin_note | text | Null | Ghi chú quản trị |
| 9 | resolved_at | datetime | Null | Ngày phân xử |
| 10 | created_at | datetime | Not null | Ngày tạo |

---

### · Bảng Withdrawal_requests (rút / hủy công việc)

**Bảng 2. 23. Bảng Withdrawal_requests**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | job_id | int | Not null | Khóa ngoại công việc |
| 3 | requester_id | int | Not null | Người gửi yêu cầu |
| 4 | type | enum | Not null | Loại (rút / hủy) |
| 5 | status | enum | Not null | Trạng thái yêu cầu |
| 6 | reason | text | Null | Lý do |
| 7 | penalty_fee | decimal(15,2) | Not null | Số tiền phạt |
| 8 | penalty_percent | int | Not null | Tỷ lệ phạt (%) |
| 9 | response_message | text | Null | Phản hồi khi xử lý |
| 10 | responded_at | datetime | Null | Thời điểm xử lý |
| 11 | created_at | datetime | Not null | Ngày tạo |

---

### · Bảng Balance_deposits (nạp số dư)

**Bảng 2. 24. Bảng Balance_deposits**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | app_trans_id | varchar(50) | Not null | Mã giao dịch (duy nhất) |
| 3 | user_id | int | Not null | Khóa ngoại người dùng |
| 4 | amount | decimal(15,2) | Not null | Số tiền nạp |
| 5 | description | varchar(255) | Null | Mô tả |
| 6 | order_url | varchar(255) | Null | URL thanh toán |
| 7 | status | enum | Not null | Trạng thái (chờ, đã thanh toán, hủy, hết hạn) |
| 8 | payment_gateway | varchar(20) | Null | Cổng thanh toán (VNPay) |
| 9 | paid_at | datetime | Null | Ngày thanh toán |
| 10 | created_at | datetime | Not null | Ngày tạo giao dịch |

---

### · Bảng Credit_purchases (mua điểm)

**Bảng 2. 25. Bảng Credit_purchases**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | user_id | int | Not null | Khóa ngoại người dùng |
| 3 | credit_package | enum | Not null | Gói điểm |
| 4 | credits_amount | int | Not null | Số điểm mua |
| 5 | total_amount | decimal(15,2) | Not null | Số tiền trừ ví |
| 6 | status | enum | Not null | Trạng thái giao dịch |
| 7 | paid_at | datetime | Null | Ngày hoàn tất |
| 8 | created_at | datetime | Not null | Ngày giao dịch |

---

### · Bảng Conversations (cuộc hội thoại)

**Bảng 2. 26. Bảng Conversations**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | initiator_id | int | Not null | Người gửi yêu cầu kết nối |
| 3 | receiver_id | int | Not null | Người nhận |
| 4 | status | enum | Not null | Trạng thái (chờ, chấp nhận, từ chối, chặn) |
| 5 | first_message | text | Null | Tin nhắn đầu tiên |
| 6 | last_message | varchar(255) | Null | Tin nhắn cuối |
| 7 | last_message_time | datetime | Null | Thời điểm tin cuối |
| 8 | initiator_unread_count | int | Null | Số tin chưa đọc (người gửi) |
| 9 | receiver_unread_count | int | Null | Số tin chưa đọc (người nhận) |
| 10 | created_at | datetime | Not null | Ngày tạo |
| 11 | updated_at | datetime | Null | Ngày cập nhật |

---

### · Bảng Messages (tin nhắn)

**Bảng 2. 27. Bảng Messages**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | conversation_id | int | Not null | Khóa ngoại cuộc hội thoại |
| 3 | sender_id | int | Not null | Khóa ngoại người gửi |
| 4 | content | text | Not null | Nội dung tin nhắn |
| 5 | message_type | enum | Null | Loại tin (text, ảnh, file) |
| 6 | status | enum | Null | Trạng thái tin (đã gửi, đã đọc, …) |
| 7 | file_id | int | Null | Khóa ngoại tệp đính kèm |
| 8 | is_deleted | tinyint(1) | Null | Đã xóa |
| 9 | created_at | datetime | Not null | Thời điểm gửi |

---

### · Bảng File_uploads (tệp đính kèm)

**Bảng 2. 28. Bảng File_uploads**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | public_id | varchar(255) | Not null | Mã tệp trên Cloudinary |
| 3 | url | varchar(255) | Not null | Đường dẫn tệp |
| 4 | original_filename | varchar(255) | Not null | Tên tệp gốc |
| 5 | file_type | enum | Not null | Loại tệp (ảnh, tài liệu) |
| 6 | usage | enum | Not null | Mục đích sử dụng |
| 7 | uploader_id | int | Not null | Khóa ngoại người upload |
| 8 | size_bytes | bigint | Not null | Dung lượng tệp |
| 9 | created_at | datetime | Not null | Ngày upload |

---

### · Bảng Notifications (thông báo)

**Bảng 2. 29. Bảng Notifications**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | user_id | int | Not null | Khóa ngoại người nhận |
| 3 | type | enum | Not null | Loại thông báo |
| 4 | title | varchar(255) | Not null | Tiêu đề |
| 5 | message | text | Null | Nội dung |
| 6 | reference_id | int | Null | ID đối tượng liên quan |
| 7 | reference_type | varchar(255) | Null | Loại đối tượng liên quan |
| 8 | is_read | tinyint(1) | Not null | Đã đọc |
| 9 | created_at | datetime | Not null | Thời điểm tạo |

---

### · Bảng Refresh_tokens (đăng nhập)

**Bảng 2. 30. Bảng Refresh_tokens**

| STT | Tên | Kiểu dữ liệu | Nullable | Mô tả |
|-----|-----|--------------|----------|--------|
| 1 | id | int | Not null | Khóa chính |
| 2 | user_id | int | Not null | Khóa ngoại người dùng |
| 3 | token | varchar(255) | Not null | Refresh token (duy nhất) |
| 4 | expires_at | datetime | Not null | Thời điểm hết hạn |
| 5 | created_at | datetime | Not null | Ngày tạo |
