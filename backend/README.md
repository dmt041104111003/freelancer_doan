# Backend - Freelancer Platform API

REST API được xây dựng với Spring Boot, cung cấp các endpoints cho nền tảng Freelancer.

## Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────────────┐
│                           SPRING BOOT APPLICATION                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │  Controller │───▶│   Service   │───▶│ Repository  │             │
│  │   (REST)    │    │  (Business) │    │   (JPA)     │             │
│  └─────────────┘    └─────────────┘    └──────┬──────┘             │
│         │                  │                   │                    │
│         │                  │                   ▼                    │
│         │                  │           ┌─────────────┐              │
│         │                  │           │ PostgreSQL  │              │
│         │                  │           └─────────────┘              │
│         │                  │                                        │
│         ▼                  ▼                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   Security  │    │    Redis    │    │  Cloudinary │             │
│  │  (JWT/CORS) │    │ (OTP/Cache) │    │   (Files)   │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐                                │
│  │  WebSocket  │    │   ZaloPay   │                                │
│  │   (STOMP)   │    │  (Payment)  │                                │
│  └─────────────┘    └─────────────┘                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Request Flow

```
                              ┌─────────────────┐
                              │   HTTP Request  │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  RateLimitFilter│ ──▶ Kiểm tra rate limit
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  JwtAuthFilter  │ ──▶ Xác thực JWT từ Cookie
                              └────────┬────────┘
                                       │
                         ┌─────────────┼─────────────┐
                         │             │             │
                         ▼             ▼             ▼
                   ┌──────────┐  ┌──────────┐  ┌──────────┐
                   │ Public   │  │Protected │  │  Admin   │
                   │ Endpoint │  │ Endpoint │  │ Endpoint │
                   └──────────┘  └──────────┘  └──────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Controller    │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │    Service      │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Repository    │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Database      │
                              └─────────────────┘
```

## Tech Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL (NeonDB)
- **Cache/Session**: Redis (Upstash)
- **Authentication**: JWT + HTTP-only Cookies
- **File Upload**: Cloudinary
- **Payment**: ZaloPay
- **Real-time**: WebSocket (STOMP over SockJS)
- **Email**: Gmail SMTP

## Cấu trúc thư mục

```
src/main/java/com/workhub/api/
├── config/                    # Cấu hình ứng dụng
│   ├── CloudinaryConfig.java  # Cấu hình Cloudinary
│   ├── RateLimitConfig.java   # Rate limiting
│   ├── RedisConfig.java       # Redis configuration
│   ├── SecurityConfig.java    # Spring Security + CORS
│   ├── WebSocketConfig.java   # WebSocket STOMP
│   └── ZaloPayConfig.java     # ZaloPay payment
│
├── controller/                # REST Controllers
│   ├── AuthController.java    # Xác thực (login, register, OTP)
│   ├── UserController.java    # Quản lý user
│   ├── JobController.java     # Quản lý công việc
│   ├── ChatController.java    # Chat & messages
│   ├── NotificationController.java
│   ├── BalanceController.java # Nạp tiền
│   ├── CreditController.java  # Mua credits
│   ├── DisputeController.java # Tranh chấp
│   ├── FileUploadController.java
│   └── ...
│
├── dto/                       # Data Transfer Objects
│   ├── request/               # Request DTOs
│   └── response/              # Response DTOs
│
├── entity/                    # JPA Entities
│   ├── User.java
│   ├── Role.java
│   ├── Job.java
│   ├── JobApplication.java
│   ├── Conversation.java
│   ├── ChatMessage.java
│   ├── Notification.java
│   └── ...
│
├── exception/                 # Custom Exceptions
│   ├── GlobalExceptionHandler.java
│   └── ...
│
├── repository/                # JPA Repositories
│
├── security/                  # Security components
│   ├── jwt/
│   │   ├── JwtAuthFilter.java # JWT filter
│   │   ├── JwtUtils.java      # JWT utilities
│   │   └── AuthEntryPoint.java
│   ├── RateLimitFilter.java
│   └── UserDetailsImpl.java
│
├── seeder/                    # Database seeders
│   ├── RoleSeeder.java        # Tạo roles mặc định
│   └── AdminSeeder.java       # Tạo admin account
│
├── service/                   # Business Logic
│   ├── AuthService.java
│   ├── UserService.java
│   ├── JobService.java
│   ├── JobApplicationService.java
│   ├── ChatService.java
│   ├── EmailService.java
│   ├── OtpService.java
│   └── ...
│
└── WorkHubApplication.java    # Main class
```

## Cài đặt

### 1. Yêu cầu
- Java 17+
- Maven 3.8+
- PostgreSQL (hoặc NeonDB account)
- Redis (hoặc Upstash account)

### 2. Clone và cài đặt dependencies
```bash
cd backend
./mvnw clean install
```

### 3. Tạo file `.env`
```bash
cp .env.example .env
# Sửa các giá trị trong .env
```

### 4. Chạy ứng dụng
```bash
./mvnw spring-boot:run
```

Server sẽ chạy tại: http://localhost:8080

## Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
# ============================================
# DATABASE - PostgreSQL (NeonDB)
# ============================================
DB_URL=jdbc:postgresql://host:5432/database?sslmode=require
DB_USERNAME=your_username
DB_PASSWORD=your_password

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=your-256-bit-secret-key-here-at-least-32-characters
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# ============================================
# OTP CONFIGURATION
# ============================================
OTP_EXPIRATION=600000
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN=60000

# ============================================
# EMAIL - Gmail SMTP
# ============================================
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# ============================================
# ADMIN ACCOUNT
# ============================================
ADMIN_EMAIL=admin@freelancer.vn
ADMIN_PASSWORD=admin123456
ADMIN_FULLNAME=Administrator

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_REGISTER_CAPACITY=5
RATE_LIMIT_REGISTER_REFILL_DURATION=3600
RATE_LIMIT_LOGIN_CAPACITY=10
RATE_LIMIT_LOGIN_REFILL_DURATION=60

# ============================================
# REDIS (Upstash)
# ============================================
REDIS_HOST=your-redis-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_SSL=true

# ============================================
# CORS
# ============================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.vercel.app

# ============================================
# GOOGLE OAUTH2
# ============================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ============================================
# ZALOPAY (Sandbox)
# ============================================
ZALOPAY_APP_ID=2553
ZALOPAY_KEY1=PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL
ZALOPAY_KEY2=kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2
PAYMENT_RETURN_URL=http://localhost:3000/payment/result
PAYMENT_TEST_MODE=true

# ============================================
# COOKIE (Production)
# ============================================
# Local: COOKIE_SECURE=false, COOKIE_SAME_SITE=Lax
# Production (cross-origin): COOKIE_SECURE=true, COOKIE_SAME_SITE=None
COOKIE_SECURE=false
COOKIE_SAME_SITE=Lax

# ============================================
# CLOUDINARY
# ============================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Cấu hình quan trọng

### Cookie cho Cross-Origin (Production)

Khi deploy frontend và backend ở khác domain:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=None
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Gmail App Password

1. Bật 2-Step Verification trong Google Account
2. Vào https://myaccount.google.com/apppasswords
3. Tạo App Password cho "Mail"
4. Dùng password 16 ký tự được tạo

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Đăng ký tài khoản | No |
| POST | `/verify-otp` | Xác thực OTP | No |
| POST | `/resend-otp` | Gửi lại OTP | No |
| POST | `/login` | Đăng nhập | No |
| POST | `/logout` | Đăng xuất | Yes |
| POST | `/refresh-token` | Làm mới token | No |
| POST | `/google` | Đăng nhập Google | No |
| POST | `/forgot-password` | Quên mật khẩu | No |
| POST | `/reset-password` | Đặt lại mật khẩu | No |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Lấy profile hiện tại | Yes |
| PUT | `/me` | Cập nhật profile | Yes |
| PUT | `/me/password` | Đổi mật khẩu | Yes |
| POST | `/me/become-employer` | Đăng ký Employer | Yes |
| GET | `/` | Danh sách users (Admin) | Admin |
| GET | `/{id}` | Chi tiết user (Admin) | Admin |
| PUT | `/{id}/status` | Enable/Disable user | Admin |
| POST | `/{id}/credits` | Cấp credits | Admin |

### Jobs (`/api/jobs`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách công việc | No |
| GET | `/{id}` | Chi tiết công việc | No |
| GET | `/search` | Tìm kiếm | No |
| GET | `/by-skills` | Tìm theo skills | No |
| POST | `/` | Tạo công việc | Employer |
| PUT | `/{id}` | Cập nhật công việc | Employer |
| DELETE | `/{id}` | Xóa công việc | Employer |
| PATCH | `/{id}/toggle-status` | Bật/tắt trạng thái | Employer |
| PATCH | `/{id}/close` | Đóng tuyển dụng | Employer |
| GET | `/my-jobs` | Việc đã đăng | Employer |
| GET | `/my-working-jobs` | Việc đang làm | Freelancer |
| POST | `/{id}/apply` | Ứng tuyển | Freelancer |
| GET | `/{id}/applications` | DS ứng viên | Employer |
| PUT | `/applications/{id}/accept` | Chấp nhận | Employer |
| PUT | `/applications/{id}/reject` | Từ chối | Employer |
| POST | `/{id}/work/submit` | Nộp bài | Freelancer |
| PUT | `/{id}/work/approve` | Duyệt bài | Employer |
| PUT | `/{id}/work/revision` | Yêu cầu sửa | Employer |

### Chat (`/api/chat`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/search` | Tìm user để chat | Yes |
| POST | `/request` | Gửi yêu cầu chat | Yes |
| GET | `/requests/pending` | Yêu cầu đang chờ | Yes |
| POST | `/requests/{id}/accept` | Chấp nhận | Yes |
| POST | `/requests/{id}/reject` | Từ chối | Yes |
| GET | `/conversations` | DS hội thoại | Yes |
| GET | `/conversations/{id}/messages` | Tin nhắn | Yes |
| POST | `/send` | Gửi tin nhắn | Yes |
| PUT | `/messages/{id}` | Sửa tin nhắn | Yes |
| DELETE | `/messages/{id}` | Xóa tin nhắn | Yes |

### Notifications (`/api/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | DS thông báo | Yes |
| GET | `/unread-count` | Số chưa đọc | Yes |
| PATCH | `/{id}/read` | Đánh dấu đã đọc | Yes |
| PATCH | `/read-all` | Đọc tất cả | Yes |

### Balance & Credits

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/balance/deposit` | Tạo lệnh nạp tiền | Yes |
| GET | `/api/balance/my-deposits` | Lịch sử nạp | Yes |
| GET | `/api/credits/packages` | DS gói credits | No |
| POST | `/api/credits/purchase` | Mua credits | Yes |

## WebSocket

### Kết nối
```
ws://localhost:8080/ws
```

### Channels
- `/user/queue/messages` - Tin nhắn mới
- `/user/queue/notifications` - Thông báo
- `/user/queue/online-status` - Trạng thái online
- `/user/queue/message-status` - Trạng thái tin nhắn

---

## Sequence Diagrams

### 1. Authentication Flow

```
┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
│ Client │          │  Auth  │          │  User  │          │ Redis  │
│        │          │Controller         │Service │          │        │
└───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
    │                   │                   │                   │
    │ POST /login       │                   │                   │
    │──────────────────▶│                   │                   │
    │                   │ login(email,pwd)  │                   │
    │                   │──────────────────▶│                   │
    │                   │                   │                   │
    │                   │                   │ findByEmail()     │
    │                   │                   │──────▶ [Database] │
    │                   │                   │                   │
    │                   │                   │ verify password   │
    │                   │                   │──────────────────▶│
    │                   │                   │                   │
    │                   │                   │ generateJWT()     │
    │                   │◀──────────────────│                   │
    │                   │                   │                   │
    │                   │ setTokenCookies() │                   │
    │◀──────────────────│                   │                   │
    │                   │                   │                   │
    │ Set-Cookie:       │                   │                   │
    │ accessToken=xxx   │                   │                   │
    │ refreshToken=xxx  │                   │                   │
```

### 2. Job Creation Flow

```
┌────────┐       ┌────────┐       ┌────────┐       ┌────────┐
│Employer│       │  Job   │       │  Job   │       │  User  │
│        │       │Controller      │Service │       │Service │
└───┬────┘       └───┬────┘       └───┬────┘       └───┬────┘
    │                │                │                │
    │ POST /jobs     │                │                │
    │───────────────▶│                │                │
    │                │                │                │
    │                │ createJob()    │                │
    │                │───────────────▶│                │
    │                │                │                │
    │                │                │ getById(userId)│
    │                │                │───────────────▶│
    │                │                │                │
    │                │                │ hasEnoughCredits(1)?
    │                │                │◀───────────────│
    │                │                │                │
    │                │                │ deductCredits(1)
    │                │                │───────────────▶│
    │                │                │                │
    │                │                │ save(job)      │
    │                │                │──────▶ [Database]
    │                │                │                │
    │                │◀───────────────│                │
    │◀───────────────│ Job (PENDING)  │                │
    │                │                │                │
```

### 3. Job Application & Payment Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Freelancer│    │ Employer │    │JobService│    │ Balance  │    │Notification
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │               │
     │ Apply Job     │               │               │               │
     │──────────────────────────────▶│               │               │
     │               │               │ create        │               │
     │               │               │ application   │               │
     │               │               │               │               │
     │               │               │──────────────────────────────▶│
     │               │               │               │  Notify       │
     │               │◀──────────────│──────────────────────────────▶│
     │               │ New applicant │               │               │
     │               │               │               │               │
     │               │ Accept        │               │               │
     │               │──────────────▶│               │               │
     │               │               │               │               │
     │               │               │ Check balance │               │
     │               │               │──────────────▶│               │
     │               │               │               │               │
     │               │               │ Deduct & Escrow               │
     │               │               │──────────────▶│               │
     │               │               │               │               │
     │               │               │ Update job    │               │
     │               │               │ IN_PROGRESS   │               │
     │               │               │               │               │
     │◀──────────────│◀──────────────│──────────────────────────────▶│
     │ You got the job!              │               │  Notify both  │
     │               │               │               │               │
```

### 4. Work Submission & Completion Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Freelancer│    │ Employer │    │JobService│    │ Balance  │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │ Submit Work   │               │               │
     │──────────────────────────────▶│               │
     │               │               │ Update status │
     │               │               │ SUBMITTED     │
     │               │               │               │
     │               │◀──────────────│               │
     │               │ Review work   │               │
     │               │               │               │
     │               │               │               │
     ├───────────────┼───────────────┼───────────────┤
     │   OPTION A    │   OPTION B    │   OPTION C    │
     │   Approve     │   Revision    │   Dispute     │
     ├───────────────┼───────────────┼───────────────┤
     │               │               │               │
     │               │ Approve       │               │
     │               │──────────────▶│               │
     │               │               │               │
     │               │               │ Release escrow│
     │               │               │──────────────▶│
     │               │               │               │
     │               │               │ Transfer to   │
     │               │               │ Freelancer    │
     │               │               │ (95%)         │
     │               │               │               │
     │◀──────────────│◀──────────────│               │
     │ Payment received!             │               │
     │               │               │               │
```

### 5. Dispute Resolution Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Employer │    │Freelancer│    │ Dispute  │    │  Admin   │    │ Balance  │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │               │
     │ Create Dispute│               │               │               │
     │ (with evidence)               │               │               │
     │──────────────────────────────▶│               │               │
     │               │               │ Status:       │               │
     │               │               │ PENDING_      │               │
     │               │               │ FREELANCER    │               │
     │               │               │               │               │
     │               │◀──────────────│               │               │
     │               │ Notify        │               │               │
     │               │               │               │               │
     │               │ Respond       │               │               │
     │               │ (with evidence)               │               │
     │               │──────────────▶│               │               │
     │               │               │ Status:       │               │
     │               │               │ PENDING_ADMIN │               │
     │               │               │               │               │
     │               │               │──────────────▶│               │
     │               │               │ Admin reviews │               │
     │               │               │               │               │
     │               │               │◀──────────────│               │
     │               │               │ resolveDispute│               │
     │               │               │ (winner)      │               │
     │               │               │               │               │
     │               │               │──────────────────────────────▶│
     │               │               │               │ Release escrow│
     │               │               │               │ to winner     │
     │               │               │               │               │
     │◀──────────────│◀──────────────│               │               │
     │ Result notification           │               │               │
```

---

## Database Schema

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA OVERVIEW                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    roles     │
                                    ├──────────────┤
                                    │ id (PK)      │
                                    │ name (ENUM)  │
                                    └──────┬───────┘
                                           │ M:N
                                           ▼
┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
│   user_skills    │◀─────────────│      users       │─────────────▶│ user_roles       │
├──────────────────┤     1:N      ├──────────────────┤     M:N      ├──────────────────┤
│ user_id (FK)     │              │ id (PK)          │              │ user_id (FK)     │
│ skill            │              │ email (UNIQUE)   │              │ role_id (FK)     │
└──────────────────┘              │ password         │              └──────────────────┘
                                  │ full_name        │
┌──────────────────┐              │ phone_number     │              ┌──────────────────┐
│user_open_to_work │◀─────────────│ avatar_url       │─────────────▶│  notifications   │
│     _roles       │     1:N      │ credits          │     1:N      ├──────────────────┤
├──────────────────┤              │ balance          │              │ id (PK)          │
│ user_id (FK)     │              │ trust_score      │              │ user_id (FK)     │
│ role             │              │ untrust_score    │              │ type (ENUM)      │
└──────────────────┘              │ ...              │              │ title            │
                                  └────────┬─────────┘              │ message          │
                                           │                        │ is_read          │
                    ┌──────────────────────┼──────────────────────┐ └──────────────────┘
                    │                      │                      │
                    ▼                      ▼                      ▼
          ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
          │      jobs        │   │  conversations   │   │  balance_deposits│
          ├──────────────────┤   ├──────────────────┤   ├──────────────────┤
          │ id (PK)          │   │ id (PK)          │   │ id (PK)          │
          │ employer_id (FK) │   │ initiator_id(FK) │   │ user_id (FK)     │
          │ title            │   │ receiver_id (FK) │   │ amount           │
          │ description      │   │ status (ENUM)    │   │ status (ENUM)    │
          │ budget           │   │ last_message     │   │ app_trans_id     │
          │ status (ENUM)    │   │ blocked_by_id    │   └──────────────────┘
          │ escrow_amount    │   └────────┬─────────┘
          │ ...              │            │
          └────────┬─────────┘            │ 1:N
                   │                      ▼
                   │            ┌──────────────────┐
                   │            │  chat_messages   │
                   │            ├──────────────────┤
                   │            │ id (PK)          │
                   │            │ conversation_id  │
                   │            │ sender_id (FK)   │
                   │            │ content          │
                   │            │ message_type     │
                   │            │ status (ENUM)    │
                   │            │ reply_to_id (FK) │
                   │            │ file_id (FK)     │
                   │            └──────────────────┘
                   │
    ┌──────────────┼──────────────┬──────────────────┐
    │              │              │                  │
    ▼              ▼              ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│ job_skills   │ │job_applications│  disputes    │ │withdrawal_requests│
├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────────┤
│ job_id (FK)  │ │ id (PK)      │ │ id (PK)      │ │ id (PK)          │
│ skill        │ │ job_id (FK)  │ │ job_id (FK)  │ │ job_id (FK)      │
└──────────────┘ │ freelancer_id│ │ employer_id  │ │ requester_id(FK) │
                 │ status(ENUM) │ │ freelancer_id│ │ type (ENUM)      │
                 │ work_status  │ │ status(ENUM) │ │ status (ENUM)    │
                 │ cover_letter │ │ admin_note   │ │ penalty_fee      │
                 │ work_url     │ │ resolved_by  │ └──────────────────┘
                 └──────────────┘ └──────────────┘
```

---

### Chi tiết từng bảng

#### 1. `users` - Người dùng

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID người dùng |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Email đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu (BCrypt) |
| `full_name` | VARCHAR(100) | NOT NULL | Họ và tên |
| `phone_number` | VARCHAR(20) | | Số điện thoại |
| `avatar_url` | VARCHAR(500) | | URL ảnh đại diện |
| `cover_image_url` | VARCHAR(500) | | URL ảnh bìa |
| `title` | VARCHAR(200) | | Chức danh/Tiêu đề |
| `location` | VARCHAR(100) | | Địa điểm |
| `company` | VARCHAR(200) | | Công ty |
| `bio` | TEXT | | Giới thiệu bản thân |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Đã xác minh danh tính |
| `is_open_to_work` | BOOLEAN | DEFAULT FALSE | Sẵn sàng nhận việc |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email đã xác thực |
| `enabled` | BOOLEAN | DEFAULT TRUE | Tài khoản active |
| `credits` | INT | DEFAULT 20 | Số credits hiện có |
| `balance` | DECIMAL(15,2) | DEFAULT 0 | Số dư ví (VND) |
| `last_daily_credit_date` | DATE | | Ngày nhận credit hàng ngày |
| `bank_account_number` | VARCHAR(50) | | Số tài khoản ngân hàng |
| `bank_name` | VARCHAR(100) | | Tên ngân hàng |
| `trust_score` | INT | DEFAULT 0 | Điểm uy tín |
| `untrust_score` | INT | DEFAULT 0 | Điểm không uy tín |
| `last_active_at` | TIMESTAMP | | Lần hoạt động cuối |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Bảng phụ:**
- `user_skills` - Skills của user (1:N)
- `user_open_to_work_roles` - Các role muốn nhận việc (1:N)
- `user_roles` - Phân quyền (M:N với `roles`)

---

#### 2. `roles` - Vai trò

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | INT | PK, AUTO_INCREMENT | ID role |
| `name` | ENUM | UNIQUE, NOT NULL | Tên role |

**Giá trị ENUM `ERole`:**
```java
ROLE_ADMIN       // Quản trị viên
ROLE_FREELANCER  // Người làm việc tự do
ROLE_EMPLOYER    // Người đăng việc
```

---

#### 3. `jobs` - Công việc

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID công việc |
| `employer_id` | BIGINT | FK → users | Người đăng |
| `title` | VARCHAR(200) | NOT NULL | Tiêu đề |
| `description` | TEXT | NOT NULL | Mô tả chi tiết |
| `context` | TEXT | | Bối cảnh dự án |
| `requirements` | TEXT | | Yêu cầu |
| `deliverables` | TEXT | | Sản phẩm bàn giao |
| `complexity` | ENUM | DEFAULT 'INTERMEDIATE' | Độ phức tạp |
| `duration` | ENUM | DEFAULT 'SHORT_TERM' | Thời gian |
| `work_type` | ENUM | DEFAULT 'PART_TIME' | Loại công việc |
| `budget` | DECIMAL(15,2) | | Ngân sách (VND) |
| `escrow_amount` | DECIMAL(15,2) | | Số tiền đang giữ |
| `currency` | VARCHAR(10) | DEFAULT 'VND' | Đơn vị tiền tệ |
| `application_deadline` | TIMESTAMP | | Hạn ứng tuyển |
| `expected_start_date` | TIMESTAMP | | Ngày bắt đầu dự kiến |
| `submission_days` | INT | DEFAULT 1 | Số ngày nộp bài |
| `review_days` | INT | DEFAULT 2 | Số ngày review |
| `status` | ENUM | DEFAULT 'DRAFT' | Trạng thái |
| `view_count` | INT | DEFAULT 0 | Lượt xem |
| `application_count` | INT | DEFAULT 0 | Số đơn ứng tuyển |
| `rejection_reason` | TEXT | | Lý do từ chối |
| `work_submission_deadline` | TIMESTAMP | | Hạn nộp sản phẩm |
| `work_review_deadline` | TIMESTAMP | | Hạn review |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Giá trị ENUM `EJobStatus`:**
```java
DRAFT              // Bản nháp
PENDING_APPROVAL   // Chờ admin duyệt
OPEN               // Đang tuyển (đã duyệt)
REJECTED           // Admin từ chối
IN_PROGRESS        // Đang thực hiện
DISPUTED           // Đang tranh chấp
COMPLETED          // Hoàn thành
CLOSED             // Đã đóng
CANCELLED          // Đã hủy
```

**Giá trị ENUM `EJobComplexity`:**
```java
ENTRY_LEVEL   // Dễ
INTERMEDIATE  // Trung bình
EXPERT        // Khó
```

**Giá trị ENUM `EJobDuration`:**
```java
SHORT_TERM   // Ngắn hạn (< 1 tuần)
MEDIUM_TERM  // Trung hạn (1-4 tuần)
LONG_TERM    // Dài hạn (> 1 tháng)
```

---

#### 4. `job_applications` - Đơn ứng tuyển

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID đơn |
| `job_id` | BIGINT | FK → jobs | Công việc |
| `freelancer_id` | BIGINT | FK → users | Freelancer |
| `cover_letter` | TEXT | | Thư xin việc |
| `status` | ENUM | DEFAULT 'PENDING' | Trạng thái đơn |
| `work_status` | ENUM | DEFAULT 'NOT_STARTED' | Trạng thái công việc |
| `work_submission_url` | VARCHAR(500) | | URL sản phẩm |
| `work_submission_note` | TEXT | | Ghi chú nộp bài |
| `work_submitted_at` | TIMESTAMP | | Thời gian nộp |
| `work_revision_note` | TEXT | | Ghi chú yêu cầu sửa |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**UNIQUE Constraint:** `(job_id, freelancer_id)` - Mỗi freelancer chỉ ứng tuyển 1 lần/job

**Giá trị ENUM `EApplicationStatus`:**
```java
PENDING    // Chờ xử lý
ACCEPTED   // Đã chấp nhận
REJECTED   // Đã từ chối
WITHDRAWN  // Đã rút đơn
```

**Giá trị ENUM `EWorkStatus`:**
```java
NOT_STARTED         // Chưa bắt đầu
IN_PROGRESS         // Đang làm
SUBMITTED           // Đã nộp sản phẩm
REVISION_REQUESTED  // Yêu cầu chỉnh sửa
APPROVED            // Đã duyệt
```

---

#### 5. `conversations` - Hội thoại

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID hội thoại |
| `initiator_id` | BIGINT | FK → users | Người khởi tạo |
| `receiver_id` | BIGINT | FK → users | Người nhận |
| `status` | ENUM | DEFAULT 'PENDING' | Trạng thái |
| `blocked_by_id` | BIGINT | | ID người block |
| `first_message` | TEXT | | Tin nhắn đầu tiên |
| `last_message` | VARCHAR(255) | | Tin nhắn cuối |
| `last_message_type` | ENUM | | Loại tin nhắn cuối |
| `last_message_deleted` | BOOLEAN | DEFAULT FALSE | Tin cuối bị xóa |
| `last_message_status` | ENUM | | Trạng thái tin cuối |
| `last_message_id` | BIGINT | | ID tin nhắn cuối |
| `last_message_sender_id` | BIGINT | | Người gửi tin cuối |
| `last_message_time` | TIMESTAMP | | Thời gian tin cuối |
| `initiator_unread_count` | INT | DEFAULT 0 | Số tin chưa đọc (initiator) |
| `receiver_unread_count` | INT | DEFAULT 0 | Số tin chưa đọc (receiver) |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Giá trị ENUM `EConversationStatus`:**
```java
PENDING   // Đang chờ accept
ACCEPTED  // Đã accept, có thể chat
REJECTED  // Bị từ chối
BLOCKED   // Bị block
```

---

#### 6. `chat_messages` - Tin nhắn

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID tin nhắn |
| `conversation_id` | BIGINT | FK → conversations | Hội thoại |
| `sender_id` | BIGINT | FK → users | Người gửi |
| `content` | TEXT | NOT NULL | Nội dung |
| `message_type` | ENUM | DEFAULT 'TEXT' | Loại tin nhắn |
| `status` | ENUM | DEFAULT 'SENT' | Trạng thái |
| `is_edited` | BOOLEAN | DEFAULT FALSE | Đã sửa |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Đã xóa |
| `edited_at` | TIMESTAMP | | Thời gian sửa |
| `deleted_at` | TIMESTAMP | | Thời gian xóa |
| `reply_to_id` | BIGINT | FK → chat_messages | Reply tin nhắn |
| `file_id` | BIGINT | FK → file_uploads | File đính kèm |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |

**Indexes:**
- `idx_chat_message_conversation` (conversation_id)
- `idx_chat_message_sender` (sender_id)
- `idx_chat_message_created_at` (created_at)

**Giá trị ENUM `EMessageType`:**
```java
TEXT   // Văn bản
IMAGE  // Hình ảnh
FILE   // File đính kèm
```

**Giá trị ENUM `EMessageStatus`:**
```java
SENT       // Đã gửi
DELIVERED  // Đã nhận
READ       // Đã đọc
```

---

#### 7. `disputes` - Tranh chấp

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID tranh chấp |
| `job_id` | BIGINT | FK → jobs | Công việc |
| `employer_id` | BIGINT | FK → users | Employer |
| `freelancer_id` | BIGINT | FK → users | Freelancer |
| `employer_evidence_url` | VARCHAR(500) | | URL bằng chứng employer |
| `employer_evidence_file_id` | BIGINT | | File ID bằng chứng |
| `employer_description` | TEXT | NOT NULL | Mô tả sai phạm |
| `freelancer_evidence_url` | VARCHAR(500) | | URL bằng chứng freelancer |
| `freelancer_evidence_file_id` | BIGINT | | File ID phản hồi |
| `freelancer_description` | TEXT | | Mô tả phản hồi |
| `freelancer_deadline` | TIMESTAMP | | Hạn phản hồi |
| `status` | ENUM | DEFAULT 'PENDING_FREELANCER_RESPONSE' | Trạng thái |
| `admin_note` | TEXT | | Ghi chú admin |
| `resolved_by` | BIGINT | FK → users | Admin xử lý |
| `resolved_at` | TIMESTAMP | | Thời gian xử lý |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Giá trị ENUM `EDisputeStatus`:**
```java
PENDING_FREELANCER_RESPONSE  // Chờ freelancer phản hồi
PENDING_ADMIN_DECISION       // Chờ admin quyết định
EMPLOYER_WON                 // Employer thắng
FREELANCER_WON               // Freelancer thắng
CANCELLED                    // Đã hủy
```

---

#### 8. `notifications` - Thông báo

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID thông báo |
| `user_id` | BIGINT | FK → users | Người nhận |
| `type` | ENUM | NOT NULL | Loại thông báo |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề |
| `message` | TEXT | | Nội dung |
| `reference_id` | BIGINT | | ID entity liên quan |
| `reference_type` | VARCHAR(50) | | Loại entity |
| `is_read` | BOOLEAN | DEFAULT FALSE | Đã đọc |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |

**Giá trị ENUM `ENotificationType`:**
```java
JOB_APPLICATION        // Có đơn ứng tuyển mới
APPLICATION_ACCEPTED   // Đơn được chấp nhận
APPLICATION_REJECTED   // Đơn bị từ chối
WORK_SUBMITTED         // Freelancer nộp bài
WORK_APPROVED          // Bài được duyệt
WORK_REVISION          // Yêu cầu chỉnh sửa
PAYMENT_RECEIVED       // Nhận thanh toán
DISPUTE_CREATED        // Có tranh chấp mới
DISPUTE_RESOLVED       // Tranh chấp đã giải quyết
CHAT_REQUEST           // Có yêu cầu chat
SYSTEM                 // Thông báo hệ thống
```

---

#### 9. `balance_deposits` - Nạp tiền

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID giao dịch |
| `app_trans_id` | VARCHAR(50) | UNIQUE, NOT NULL | Mã giao dịch app |
| `zp_trans_id` | BIGINT | | Mã giao dịch ZaloPay |
| `user_id` | BIGINT | FK → users | Người nạp |
| `amount` | DECIMAL(15,2) | NOT NULL | Số tiền |
| `description` | VARCHAR(500) | | Mô tả |
| `order_url` | VARCHAR(1000) | | URL thanh toán |
| `qr_code` | TEXT | | QR code |
| `zp_trans_token` | VARCHAR(100) | | Token ZaloPay |
| `status` | ENUM | DEFAULT 'PENDING' | Trạng thái |
| `paid_at` | TIMESTAMP | | Thời gian thanh toán |
| `expired_at` | TIMESTAMP | | Thời gian hết hạn |
| `payment_channel` | INT | | Kênh thanh toán |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Giá trị ENUM `EDepositStatus`:**
```java
PENDING    // Chờ thanh toán
PAID       // Đã thanh toán
CANCELLED  // Đã hủy
EXPIRED    // Hết hạn
```

---

#### 10. `credit_purchases` - Mua credits

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID giao dịch |
| `app_trans_id` | VARCHAR(50) | UNIQUE, NOT NULL | Mã giao dịch |
| `zp_trans_id` | BIGINT | | Mã ZaloPay |
| `user_id` | BIGINT | FK → users | Người mua |
| `credit_package` | ENUM | NOT NULL | Gói credits |
| `credits_amount` | INT | NOT NULL | Số credits |
| `total_amount` | DECIMAL(15,2) | NOT NULL | Tổng tiền |
| `currency` | VARCHAR(10) | DEFAULT 'VND' | Đơn vị tiền |
| `status` | ENUM | DEFAULT 'PENDING' | Trạng thái |
| `credits_granted` | BOOLEAN | DEFAULT FALSE | Đã cấp credits |
| `paid_at` | TIMESTAMP | | Thời gian TT |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Giá trị ENUM `ECreditPackage`:**
```java
BASIC     // 10 credits - 50,000 VND
STANDARD  // 25 credits - 100,000 VND  
PREMIUM   // 60 credits - 200,000 VND
```

---

#### 11. `withdrawal_requests` - Yêu cầu hủy/rút

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID yêu cầu |
| `job_id` | BIGINT | FK → jobs | Công việc |
| `requester_id` | BIGINT | FK → users | Người yêu cầu |
| `type` | ENUM | NOT NULL | Loại yêu cầu |
| `status` | ENUM | DEFAULT 'PENDING' | Trạng thái |
| `reason` | TEXT | | Lý do |
| `penalty_fee` | DECIMAL(15,2) | NOT NULL | Phí phạt |
| `penalty_percent` | INT | NOT NULL | % phạt |
| `response_message` | TEXT | | Phản hồi |
| `responder_id` | BIGINT | FK → users | Người phản hồi |
| `responded_at` | TIMESTAMP | | Thời gian phản hồi |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |
| `updated_at` | TIMESTAMP | AUTO | Ngày cập nhật |

**Giá trị ENUM `EWithdrawalRequestType`:**
```java
FREELANCER_WITHDRAW  // Freelancer xin rút
EMPLOYER_CANCEL      // Employer xin hủy
```

**Giá trị ENUM `EWithdrawalRequestStatus`:**
```java
PENDING    // Chờ xử lý
APPROVED   // Đã duyệt
REJECTED   // Đã từ chối
CANCELLED  // Đã hủy
```

---

#### 12. `file_uploads` - File upload

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID file |
| `public_id` | VARCHAR(255) | UNIQUE, NOT NULL | Cloudinary public_id |
| `url` | VARCHAR(500) | NOT NULL | URL file |
| `secure_url` | VARCHAR(500) | NOT NULL | HTTPS URL |
| `original_filename` | VARCHAR(255) | NOT NULL | Tên file gốc |
| `file_type` | ENUM | NOT NULL | Loại file |
| `mime_type` | VARCHAR(100) | | MIME type |
| `format` | VARCHAR(20) | | Định dạng |
| `size_bytes` | BIGINT | NOT NULL | Kích thước (bytes) |
| `width` | INT | | Chiều rộng (ảnh) |
| `height` | INT | | Chiều cao (ảnh) |
| `usage` | ENUM | NOT NULL | Mục đích sử dụng |
| `reference_type` | VARCHAR(50) | | Loại entity liên quan |
| `reference_id` | BIGINT | | ID entity liên quan |
| `uploader_id` | BIGINT | FK → users | Người upload |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Đã xóa |
| `deleted_at` | TIMESTAMP | | Thời gian xóa |
| `created_at` | TIMESTAMP | AUTO | Ngày tạo |

**Indexes:**
- `idx_file_upload_uploader` (uploader_id)
- `idx_file_upload_usage` (usage)
- `idx_file_upload_reference` (reference_type, reference_id)
- `idx_file_upload_public_id` (public_id)

**Giá trị ENUM `EFileType`:**
```java
IMAGE     // Hình ảnh
DOCUMENT  // Tài liệu
```

**Giá trị ENUM `EFileUsage`:**
```java
AVATAR           // Ảnh đại diện
COVER_IMAGE      // Ảnh bìa
CHAT_IMAGE       // Ảnh trong chat
CHAT_FILE        // File trong chat
WORK_SUBMISSION  // File nộp bài
DISPUTE_EVIDENCE // Bằng chứng tranh chấp
```

---

## Scheduled Tasks

```java
// JobSchedulerService.java - Chạy mỗi giờ

@Scheduled(fixedRate = 3600000) // 1 hour
public void checkDeadlines() {
    // 1. Kiểm tra submission deadline
    //    - Nếu Freelancer không nộp bài đúng hạn
    //    - Hoàn tiền cho Employer
    //    - Cộng điểm KUT cho Freelancer
    
    // 2. Kiểm tra review deadline
    //    - Nếu Employer không duyệt đúng hạn
    //    - Tự động approve và chuyển tiền cho Freelancer
}
```

---

## Deployment

### Docker

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build và chạy:
```bash
./mvnw clean package -DskipTests
docker build -t freelancer-api .
docker run -p 8080:8080 --env-file .env freelancer-api
```

### Render

1. Tạo Web Service từ GitHub
2. **Build Command**: `./mvnw clean package -DskipTests`
3. **Start Command**: `java -jar target/*.jar`
4. Thêm environment variables
5. Deploy

### Railway

1. Kết nối GitHub repo
2. Thêm environment variables
3. Deploy tự động

## Testing

```bash
# Chạy tất cả tests
./mvnw test

# Chạy test cụ thể
./mvnw test -Dtest=AuthServiceTest
```

## Troubleshooting

### Lỗi "Full authentication is required"
- Kiểm tra cookie được gửi đúng không (DevTools > Network > Cookies)
- Cross-origin: Đảm bảo `COOKIE_SECURE=true` và `COOKIE_SAME_SITE=None`
- Kiểm tra `CORS_ALLOWED_ORIGINS` có domain frontend

### Lỗi "OTP không gửi được"
- Kiểm tra `MAIL_USERNAME` và `MAIL_PASSWORD`
- Đảm bảo dùng Gmail App Password (không phải password thường)
- Kiểm tra log để xem lỗi chi tiết

### Lỗi Redis connection
- Kiểm tra `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- Upstash yêu cầu `REDIS_SSL=true`

## License

MIT License
