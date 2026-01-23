# Freelancer Platform

Nền tảng kết nối Freelancer và Nhà tuyển dụng - Giải pháp việc làm tự do #1 Việt Nam

## Tổng quan

Freelancer Platform là một ứng dụng web fullstack cho phép:
- **Freelancer** tìm kiếm và nhận công việc phù hợp với kỹ năng
- **Employer** đăng tin tuyển dụng và quản lý dự án
- **Admin** quản lý người dùng, duyệt công việc và giải quyết tranh chấp

## Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│  Spring Boot    │────▶│   PostgreSQL    │
│   (Frontend)    │     │  API (Backend)  │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Vercel        │     │   Redis         │     │   Cloudinary    │
│   (Hosting)     │     │   (Cache/OTP)   │     │   (File Store)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │                 │
                        │   ZaloPay       │
                        │   (Payment)     │
                        │                 │
                        └─────────────────┘
```

## Các vai trò trong hệ thống

| Vai trò | Mô tả | Quyền hạn |
|---------|-------|-----------|
| **Guest** | Người dùng chưa đăng nhập | Xem danh sách jobs, xem chi tiết job |
| **Freelancer** | Người làm việc tự do | Ứng tuyển jobs, nộp bài, nhận thanh toán |
| **Employer** | Người đăng việc | Đăng jobs, duyệt ứng viên, thanh toán |
| **Admin** | Quản trị viên | Toàn quyền quản lý hệ thống |

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL (NeonDB)
- **Cache**: Redis (Upstash)
- **Authentication**: JWT + HTTP-only Cookies
- **File Storage**: Cloudinary
- **Payment**: ZaloPay
- **Real-time**: WebSocket (STOMP)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / shadcn/ui
- **State Management**: React Context
- **Real-time**: SockJS + STOMP

## Tính năng chính

### 1. Xác thực & Phân quyền
- [x] Đăng ký tài khoản với xác thực OTP qua email
- [x] Đăng nhập / Đăng xuất
- [x] Đăng nhập bằng Google OAuth2
- [x] Quên mật khẩu / Đặt lại mật khẩu
- [x] Phân quyền: Admin, Employer, Freelancer
- [x] JWT Authentication với HTTP-only cookies

### 2. Quản lý Người dùng
- [x] Xem và cập nhật profile
- [x] Upload avatar và ảnh bìa
- [x] Quản lý kỹ năng (skills)
- [x] Trạng thái "Sẵn sàng nhận việc"
- [x] Thông tin ngân hàng để nhận thanh toán
- [x] Điểm uy tín (Trust Score) và điểm không uy tín (Untrust Score)
- [x] Nhận 10 credits miễn phí mỗi ngày

### 3. Quản lý Công việc (Jobs)
- [x] Đăng tin tuyển dụng (yêu cầu credits)
- [x] Tìm kiếm công việc theo từ khóa, kỹ năng
- [x] Lọc công việc theo trạng thái
- [x] Xem chi tiết công việc
- [x] Lưu công việc yêu thích
- [x] Ứng tuyển công việc với cover letter
- [x] Xem danh sách ứng viên (Employer)
- [x] Chấp nhận / Từ chối ứng viên
- [x] Lịch sử hoạt động của công việc

### 4. Quy trình làm việc
- [x] Freelancer nộp bài (submit work)
- [x] Employer duyệt bài hoặc yêu cầu chỉnh sửa
- [x] Deadline tự động cho nộp bài và duyệt bài
- [x] Tự động hoàn tiền khi quá hạn

### 5. Thanh toán & Tài chính
- [x] Nạp tiền vào ví qua ZaloPay
- [x] Mua credits bằng số dư
- [x] Escrow - Giữ tiền an toàn
- [x] Tự động chuyển tiền cho Freelancer khi hoàn thành
- [x] Lịch sử giao dịch

### 6. Yêu cầu Hủy / Rút khỏi công việc
- [x] Freelancer xin rút khỏi công việc
- [x] Employer xin hủy công việc
- [x] Phí phạt khi hủy (penalty)
- [x] Quy trình phê duyệt

### 7. Tranh chấp (Disputes)
- [x] Employer tạo tranh chấp với bằng chứng
- [x] Freelancer phản hồi tranh chấp
- [x] Admin xử lý và phân xử
- [x] Hoàn tiền theo kết quả phân xử

### 8. Chat & Tin nhắn
- [x] Gửi yêu cầu kết bạn
- [x] Chat real-time với WebSocket
- [x] Gửi ảnh và file trong chat
- [x] Reply tin nhắn
- [x] Sửa / Xóa tin nhắn
- [x] Trạng thái online/offline
- [x] Đánh dấu đã đọc
- [x] Block / Unblock người dùng

### 9. Thông báo
- [x] Thông báo real-time
- [x] Thông báo khi có ứng viên mới
- [x] Thông báo khi được chấp nhận/từ chối
- [x] Thông báo thanh toán
- [x] Đánh dấu đã đọc / Đánh dấu tất cả

### 10. Admin Dashboard
- [x] Thống kê tổng quan
- [x] Quản lý người dùng (enable/disable)
- [x] Duyệt công việc pending
- [x] Xử lý tranh chấp
- [x] Cấp credits cho user

---

## Flow Chi tiết

### Flow 1: Đăng ký & Xác thực tài khoản

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │ Frontend │    │ Backend  │    │  Redis   │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │  Nhập thông tin đăng ký       │               │
     │──────────────▶│               │               │
     │               │  POST /register               │
     │               │──────────────▶│               │
     │               │               │  Lưu OTP      │
     │               │               │──────────────▶│
     │               │               │               │
     │               │               │──── Gửi email OTP ────▶ [Email]
     │               │               │               │
     │               │◀──────────────│               │
     │◀──────────────│  Hiển thị form OTP            │
     │               │               │               │
     │  Nhập OTP     │               │               │
     │──────────────▶│               │               │
     │               │  POST /verify-otp             │
     │               │──────────────▶│               │
     │               │               │  Verify OTP   │
     │               │               │──────────────▶│
     │               │               │◀──────────────│
     │               │               │  Tạo JWT      │
     │               │◀──────────────│  Set Cookie   │
     │◀──────────────│               │               │
     │  Đăng nhập thành công         │               │
```

**Mô tả chi tiết:**
1. User điền form đăng ký (email, password, họ tên)
2. Backend tạo user với trạng thái `emailVerified = false`
3. Tạo OTP 6 số, lưu vào Redis với TTL 10 phút
4. Gửi email chứa OTP đến user
5. User nhập OTP để xác thực
6. Backend verify OTP, cập nhật `emailVerified = true`
7. Tạo JWT token và set HTTP-only cookie
8. User được chuyển đến trang chủ

---

### Flow 2: Quy trình đăng và nhận việc

```
┌──────────────────────────────────────────────────────────────────────┐
│                         EMPLOYER FLOW                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐           │
│  │ Nạp tiền│───▶│Mua Credit│───▶│Đăng Job │───▶│Chờ duyệt│           │
│  │         │    │         │    │(-1 credit)   │(PENDING)│           │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘           │
│                                                     │                 │
│                              ┌──────────────────────┴─────┐          │
│                              ▼                            ▼          │
│                        ┌─────────┐                  ┌─────────┐      │
│                        │ Approved│                  │ Rejected│      │
│                        │ (OPEN)  │                  │(hoàn credit)   │
│                        └────┬────┘                  └─────────┘      │
│                             │                                        │
│                             ▼                                        │
│                   ┌─────────────────┐                                │
│                   │ Nhận ứng tuyển  │                                │
│                   │ từ Freelancers  │                                │
│                   └────────┬────────┘                                │
│                            │                                         │
│               ┌────────────┴────────────┐                           │
│               ▼                         ▼                           │
│        ┌─────────────┐          ┌─────────────┐                     │
│        │Chấp nhận 1  │          │  Từ chối    │                     │
│        │ứng viên     │          │             │                     │
│        └──────┬──────┘          └─────────────┘                     │
│               │                                                      │
│               ▼                                                      │
│   ┌───────────────────────┐                                         │
│   │ Thanh toán (Escrow)   │                                         │
│   │ Tiền giữ trong hệ thống│                                        │
│   └───────────┬───────────┘                                         │
│               │                                                      │
│               ▼                                                      │
│      Job chuyển sang IN_PROGRESS                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                        FREELANCER FLOW                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐           │
│  │Tìm việc │───▶│Ứng tuyển│───▶│Chờ duyệt│───▶│Được chấp│           │
│  │         │    │         │    │         │    │  nhận   │           │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘           │
│                                                     │                 │
│                                                     ▼                 │
│                                            ┌─────────────┐           │
│                                            │ Làm việc    │           │
│                                            │ (deadline)  │           │
│                                            └──────┬──────┘           │
│                                                   │                  │
│                                                   ▼                  │
│                                           ┌─────────────┐            │
│                                           │ Nộp bài     │            │
│                                           │ (Submit)    │            │
│                                           └──────┬──────┘            │
│                                                  │                   │
│                              ┌───────────────────┼───────────────┐   │
│                              ▼                   ▼               ▼   │
│                       ┌──────────┐        ┌──────────┐    ┌─────────┐│
│                       │ Approved │        │ Revision │    │ Dispute ││
│                       │          │        │ Request  │    │         ││
│                       └────┬─────┘        └────┬─────┘    └─────────┘│
│                            │                   │                     │
│                            ▼                   ▼                     │
│                    ┌──────────────┐     Sửa và nộp lại              │
│                    │ Nhận tiền    │                                  │
│                    │ (auto transfer)                                 │
│                    └──────────────┘                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Trạng thái Job:**
| Status | Mô tả |
|--------|-------|
| `DRAFT` | Bản nháp, chưa submit |
| `PENDING_APPROVAL` | Chờ Admin duyệt |
| `OPEN` | Đang tuyển, Freelancer có thể ứng tuyển |
| `IN_PROGRESS` | Đã chọn Freelancer, đang làm việc |
| `SUBMITTED` | Freelancer đã nộp bài |
| `REVISION_REQUESTED` | Employer yêu cầu chỉnh sửa |
| `COMPLETED` | Hoàn thành, đã thanh toán |
| `DISPUTED` | Đang tranh chấp |
| `CANCELLED` | Đã hủy |

---

### Flow 3: Thanh toán & Escrow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                                │
└─────────────────────────────────────────────────────────────────┘

1. NẠP TIỀN VÀO VÍ
   ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
   │Employer│───▶│ ZaloPay│───▶│Callback│───▶│Cộng vào│
   │        │    │        │    │        │    │  Ví    │
   └────────┘    └────────┘    └────────┘    └────────┘

2. MUA CREDITS
   ┌────────┐    ┌────────┐    ┌────────┐
   │Chọn gói│───▶│Trừ tiền│───▶│Cộng    │
   │Credits │    │từ Ví   │    │Credits │
   └────────┘    └────────┘    └────────┘

3. ESCROW KHI CHỌN FREELANCER
   ┌────────────────────────────────────────────────────┐
   │                                                     │
   │  Employer Wallet ─────▶ System Escrow              │
   │  (Trừ budget)          (Giữ tiền an toàn)          │
   │                                                     │
   └────────────────────────────────────────────────────┘

4. THANH TOÁN KHI HOÀN THÀNH
   ┌────────────────────────────────────────────────────┐
   │                                                     │
   │  System Escrow ─────┬────▶ Freelancer Wallet (95%) │
   │                     │                               │
   │                     └────▶ Platform Fee (5%)        │
   │                                                     │
   └────────────────────────────────────────────────────┘

5. HOÀN TIỀN KHI HỦY/TRANH CHẤP
   ┌────────────────────────────────────────────────────┐
   │                                                     │
   │  System Escrow ─────┬────▶ Employer (nếu thắng)    │
   │                     │                               │
   │                     └────▶ Freelancer (nếu thắng)  │
   │                                                     │
   │  * Có thể áp dụng penalty fee                      │
   │                                                     │
   └────────────────────────────────────────────────────┘
```

---

### Flow 4: Tranh chấp (Dispute)

```
Employer                    System                      Freelancer
    │                          │                            │
    │  1. Tạo tranh chấp       │                            │
    │  (kèm bằng chứng)        │                            │
    │─────────────────────────▶│                            │
    │                          │                            │
    │                          │  2. Thông báo              │
    │                          │─────────────────────────▶  │
    │                          │                            │
    │                          │  3. Freelancer phản hồi    │
    │                          │◀─────────────────────────  │
    │                          │  (kèm bằng chứng)          │
    │                          │                            │
    │                          │                            │
    │                    ┌─────┴─────┐                      │
    │                    │   ADMIN   │                      │
    │                    │  Xem xét  │                      │
    │                    │ bằng chứng│                      │
    │                    └─────┬─────┘                      │
    │                          │                            │
    │            ┌─────────────┼─────────────┐              │
    │            ▼             │             ▼              │
    │     ┌───────────┐        │      ┌───────────┐        │
    │     │ Employer  │        │      │Freelancer │        │
    │     │   thắng   │        │      │   thắng   │        │
    │     └─────┬─────┘        │      └─────┬─────┘        │
    │           │              │            │              │
    │           ▼              │            ▼              │
    │    Hoàn tiền 100%        │     Chuyển tiền 100%      │
    │    cho Employer          │     cho Freelancer        │
    │                          │                            │
```

**Quy trình chi tiết:**
1. Employer tạo dispute với mô tả và upload bằng chứng (ảnh/file)
2. Hệ thống thông báo cho Freelancer
3. Freelancer có 3 ngày để phản hồi với bằng chứng của mình
4. Admin xem xét cả hai bên và đưa ra quyết định
5. Tiền được chuyển cho bên thắng cuộc

---

### Flow 5: Chat Real-time

```
┌─────────────────────────────────────────────────────────────┐
│                    WEBSOCKET CONNECTION                      │
└─────────────────────────────────────────────────────────────┘

User A                    Server                     User B
   │                         │                          │
   │  1. Connect WebSocket   │                          │
   │────────────────────────▶│                          │
   │                         │                          │
   │  2. Subscribe channels  │                          │
   │  /user/queue/messages   │                          │
   │────────────────────────▶│                          │
   │                         │                          │
   │                         │◀─────────────────────────│
   │                         │  3. User B connects      │
   │                         │                          │
   │  4. Send message        │                          │
   │────────────────────────▶│                          │
   │                         │  5. Save to DB           │
   │                         │  6. Broadcast to User B  │
   │                         │─────────────────────────▶│
   │                         │                          │
   │                         │  7. User B reads         │
   │                         │◀─────────────────────────│
   │                         │                          │
   │  8. Update read status  │                          │
   │◀────────────────────────│                          │
   │                         │                          │

Channels:
- /user/queue/messages        → Nhận tin nhắn mới
- /user/queue/notifications   → Nhận thông báo
- /user/queue/online-status   → Trạng thái online/offline
- /user/queue/message-status  → Trạng thái đã đọc
- /user/queue/typing          → Đang gõ...
```

---

## Cấu trúc dự án

```
freelancer_doan/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   │   └── com/workhub/api/
│   │       ├── config/      # Cấu hình (Security, Redis, WebSocket...)
│   │       ├── controller/  # REST Controllers
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── entity/      # JPA Entities
│   │       ├── exception/   # Custom Exceptions
│   │       ├── repository/  # JPA Repositories
│   │       ├── security/    # JWT, Filters
│   │       ├── seeder/      # Database Seeders
│   │       └── service/     # Business Logic
│   └── pom.xml
│
├── client/                  # Next.js Frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React Components
│   ├── context/             # React Context
│   ├── hooks/               # Custom Hooks
│   ├── lib/                 # Utilities (API, format...)
│   ├── types/               # TypeScript Types
│   └── package.json
│
└── README.md
```

## Hướng dẫn cài đặt

### Yêu cầu
- Java 17+
- Node.js 18+
- PostgreSQL hoặc NeonDB account
- Redis hoặc Upstash account
- Cloudinary account
- ZaloPay sandbox account (optional)

### 1. Clone repository
```bash
git clone <repository-url>
cd freelancer_doan
```

### 2. Cài đặt Backend
```bash
cd backend
# Tạo file .env (xem backend/README.md)
./mvnw spring-boot:run
```

### 3. Cài đặt Frontend
```bash
cd client
npm install
# Tạo file .env.local (xem client/README.md)
npm run dev
```

### 4. Truy cập
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html (nếu có)

## Deployment

### Backend (Render)
1. Tạo Web Service từ GitHub repo
2. Build Command: `./mvnw clean package -DskipTests`
3. Start Command: `java -jar target/*.jar`
4. Add environment variables

### Frontend (Vercel)
1. Import từ GitHub
2. Framework: Next.js
3. Add environment variables

## Environment Variables

Xem chi tiết trong:
- [Backend README](./backend/README.md)
- [Client README](./client/README.md)

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/verify-otp` | Xác thực OTP |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/google` | Đăng nhập Google |
| POST | `/api/auth/forgot-password` | Quên mật khẩu |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Lấy profile hiện tại |
| PUT | `/api/users/me` | Cập nhật profile |
| POST | `/api/users/me/become-employer` | Đăng ký làm Employer |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Danh sách công việc (public) |
| GET | `/api/jobs/{id}` | Chi tiết công việc |
| POST | `/api/jobs` | Tạo công việc mới |
| PUT | `/api/jobs/{id}` | Cập nhật công việc |
| POST | `/api/jobs/{id}/apply` | Ứng tuyển |
| GET | `/api/jobs/my-jobs` | Công việc đã đăng |
| GET | `/api/jobs/my-working-jobs` | Công việc đang làm |

## Screenshots

(Thêm screenshots của ứng dụng tại đây)

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Liên hệ

- Email: support@freelancer.vn
- Website: https://freelancer.vn
