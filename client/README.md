# Client - Freelancer Platform Frontend

Ứng dụng web frontend được xây dựng với Next.js 14, TypeScript và Tailwind CSS.

## Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APPLICATION                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                        APP ROUTER                            │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │    │
│  │  │  page   │  │ layout  │  │ loading │  │  error  │        │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                      │
│                               ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                        COMPONENTS                            │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │    │
│  │  │   UI    │  │  Layout │  │  Auth   │  │  Jobs   │        │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                      │
│           ┌───────────────────┼───────────────────┐                 │
│           ▼                   ▼                   ▼                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│  │   Context   │     │    Hooks    │     │     Lib     │           │
│  │  (AuthCtx)  │     │ (useProfile)│     │   (api.ts)  │           │
│  └─────────────┘     └─────────────┘     └──────┬──────┘           │
│                                                  │                  │
│                                                  ▼                  │
│                                         ┌─────────────┐            │
│                                         │  Backend    │            │
│                                         │    API      │            │
│                                         └─────────────┘            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## User Flow Diagrams

### Flow 1: User Journey - Freelancer

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FREELANCER USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Trang   │────▶│  Đăng ký │────▶│ Xác thực │────▶│ Hoàn thiện│
│   chủ    │     │          │     │   OTP    │     │  Profile  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Nhận tiền│◀────│ Employer │◀────│Nộp bài   │◀────│  Tìm &   │
│          │     │  duyệt   │     │(Submit)  │     │ ứng tuyển │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Flow 2: User Journey - Employer

```
┌─────────────────────────────────────────────────────────────────────┐
│                       EMPLOYER USER JOURNEY                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Đăng    │────▶│ Become   │────▶│ Nạp tiền │────▶│ Mua      │
│  nhập    │     │ Employer │     │ vào ví   │     │ Credits  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│Duyệt bài │◀────│ Theo dõi │◀────│Thanh toán│◀────│ Đăng việc│
│& thanh   │     │ tiến độ  │     │& chọn    │     │ mới      │
│toán      │     │          │     │ứng viên  │     │(-1 credit)
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Flow 3: Page Navigation

```
                            ┌─────────────┐
                            │   / (Home)  │
                            └──────┬──────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │   /login    │          │   /jobs     │          │  /register  │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          │                        ▼                        │
          │                 ┌─────────────┐                 │
          │                 │ /jobs/[id]  │                 │
          │                 └──────┬──────┘                 │
          │                        │                        │
          ▼                        ▼                        ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                        PROTECTED ROUTES                       │
   ├──────────────────────────────────────────────────────────────┤
   │                                                               │
   │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
   │  │ /profile  │  │ /messages │  │  /wallet  │  │  /admin   │ │
   │  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │
   │                                                               │
   │  ┌───────────────────┐  ┌───────────────────┐               │
   │  │ /my-posted-jobs   │  │ /my-accepted-jobs │               │
   │  │   └── /create     │  │                   │               │
   │  └───────────────────┘  └───────────────────┘               │
   │                                                               │
   └──────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / shadcn/ui
- **Icons**: Material Icons
- **State Management**: React Context
- **HTTP Client**: Fetch API
- **Real-time**: SockJS + STOMP
- **Form Handling**: React Hook Form (optional)
- **Toast**: Sonner

## Cấu trúc thư mục

```
client/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Trang chủ
│   ├── login/                # Đăng nhập
│   ├── register/             # Đăng ký
│   ├── forgot-password/      # Quên mật khẩu
│   ├── profile/              # Trang profile
│   ├── jobs/                 # Danh sách & chi tiết công việc
│   │   ├── page.tsx          # Danh sách jobs
│   │   └── [id]/             # Chi tiết job
│   │       ├── page.tsx
│   │       ├── applications/ # DS ứng viên
│   │       ├── edit/         # Chỉnh sửa
│   │       └── payment/      # Thanh toán
│   ├── my-posted-jobs/       # Việc đã đăng (Employer)
│   │   ├── page.tsx
│   │   └── create/           # Tạo việc mới
│   ├── my-accepted-jobs/     # Việc đã nhận (Freelancer)
│   ├── messages/             # Chat
│   ├── wallet/               # Ví tiền
│   ├── admin/                # Admin dashboard
│   ├── freelancers/          # Tìm freelancer
│   ├── how-it-works/         # Hướng dẫn
│   └── payment/
│       └── result/           # Kết quả thanh toán
│
├── components/               # React Components
│   ├── ui/                   # UI primitives (Button, Input, Dialog...)
│   ├── layout/               # Layout components (Header, Footer)
│   ├── auth/                 # Auth components (LoginForm, RegisterForm)
│   ├── profile/              # Profile components
│   ├── jobs/                 # Job-related components
│   │   ├── cards/            # Job cards
│   │   ├── lists/            # Job lists
│   │   ├── forms/            # Job forms
│   │   ├── detail/           # Job detail
│   │   ├── work/             # Work submission
│   │   ├── dispute/          # Dispute components
│   │   └── tables/           # Data tables
│   ├── messages/             # Chat components
│   │   ├── chat/             # Chat box
│   │   ├── list/             # Conversation list
│   │   └── bubble/           # Message bubble
│   ├── wallet/               # Wallet components
│   ├── admin/                # Admin components
│   └── landing/              # Landing page sections
│
├── context/                  # React Context
│   └── AuthContext.tsx       # Authentication context
│
├── hooks/                    # Custom Hooks
│   ├── useProfile.ts
│   ├── useConversations.ts
│   ├── useChatSocket.ts
│   ├── usePostedJobs.ts
│   ├── useAcceptedJobs.ts
│   └── ...
│
├── lib/                      # Utilities
│   ├── api.ts                # API client
│   ├── format.ts             # Formatting utilities
│   └── utils.ts              # Common utilities
│
├── types/                    # TypeScript Types
│   ├── user.ts
│   ├── job.ts
│   └── balance.ts
│
├── constant/                 # Constants
│   └── auth.ts               # Auth helpers
│
├── public/                   # Static files
│   ├── logo.svg
│   └── ...
│
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Cài đặt

### 1. Yêu cầu
- Node.js 18+
- npm hoặc yarn

### 2. Cài đặt dependencies
```bash
cd client
npm install
```

### 3. Tạo file `.env.local`
```bash
cp .env.example .env.local
# Sửa các giá trị
```

### 4. Chạy development server
```bash
npm run dev
```

Mở http://localhost:3000

## Environment Variables

Tạo file `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Google OAuth Client ID (for Google Sign-in)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra linting |

## Components chính

### UI Components (`components/ui/`)

Các components cơ bản được xây dựng trên Radix UI:

- `Button` - Các loại button
- `Input` - Input fields
- `Textarea` - Text area
- `Select` - Dropdown select
- `Dialog` - Modal dialogs
- `DropdownMenu` - Dropdown menus
- `Avatar` - User avatars
- `Badge` - Status badges
- `Skeleton` - Loading skeletons
- `Tabs` - Tab navigation
- `Toast` - Toast notifications (Sonner)
- `Switch` - Toggle switches
- `Tooltip` - Tooltips

### Layout Components

- `Header` - Navigation header với user menu
- `Footer` - Footer với links
- `NotificationDropdown` - Dropdown thông báo

### Auth Components

- `LoginForm` - Form đăng nhập
- `RegisterForm` - Form đăng ký với OTP
- `ForgotPasswordForm` - Form quên mật khẩu

### Job Components

- `JobsList` - Danh sách công việc
- `JobCard` - Card hiển thị job
- `JobDetail` - Chi tiết công việc
- `PostJobForm` - Form tạo/sửa việc
- `JobApplicationsTable` - Bảng ứng viên
- `WorkDialogs` - Dialogs nộp bài/duyệt

### Chat Components

- `MessagesContainer` - Container chính
- `ConversationList` - DS hội thoại
- `ChatBox` - Box chat
- `MessageBubble` - Bubble tin nhắn
- `ChatInput` - Input gửi tin nhắn

## API Client

File `lib/api.ts` chứa tất cả API calls:

```typescript
import { api } from "@/lib/api";

// Auth
await api.login({ email, password });
await api.register({ email, password, fullName });
await api.logout();

// Profile
await api.getProfile();
await api.updateProfile(data);

// Jobs
await api.getOpenJobs({ page: 0, size: 10 });
await api.getJobById(id);
await api.createJob(data);
await api.applyJob(jobId, { coverLetter });

// Chat
await api.getConversations();
await api.sendMessage(receiverId, content);
```

## Authentication

### Auth Context

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <Dashboard user={user} />;
}
```

### Protected Routes

```tsx
// app/profile/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isAuthenticated) return null;
  
  return <ProfileContent />;
}
```

## Real-time Features

### WebSocket Connection

```typescript
import { useChatSocket } from "@/hooks/useChatSocket";

function ChatPage() {
  const {
    isConnected,
    sendMessage,
    onNewMessage,
  } = useChatSocket();

  // Listen for new messages
  useEffect(() => {
    onNewMessage((message) => {
      console.log("New message:", message);
    });
  }, [onNewMessage]);

  // Send message
  const handleSend = () => {
    sendMessage(receiverId, content);
  };
}
```

## Styling

### Tailwind CSS

Sử dụng Tailwind CSS với custom colors:

```tsx
// Primary color: #04A0EF
<Button className="bg-[#04A0EF] hover:bg-[#0380BF]">
  Click me
</Button>

// Status colors
<Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
<Badge className="bg-yellow-100 text-yellow-700">Đang chờ</Badge>
<Badge className="bg-red-100 text-red-700">Từ chối</Badge>
```

### Material Icons

```tsx
import Icon from "@/components/ui/Icon";

<Icon name="person" size={24} className="text-gray-500" />
<Icon name="work" size={20} />
<Icon name="notifications" size={22} />
```

## Deployment

### Vercel (Recommended)

1. Import project từ GitHub
2. Framework Preset: Next.js
3. Thêm Environment Variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT                              │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                         AuthContext                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐  │
│  │    user     │         │ isLoading   │         │isAuthenticated│ │
│  │   (User)    │         │  (boolean)  │         │  (boolean)   │  │
│  └──────┬──────┘         └─────────────┘         └──────────────┘  │
│         │                                                           │
│         │    ┌──────────────────────────────────┐                  │
│         │    │                                  │                  │
│         ▼    ▼                                  ▼                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │  setUser()  │  │  logout()   │  │ isHydrated  │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                         localStorage                                │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  "user" : { id, email, fullName, roles, credits, ... }      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

### Data Flow khi Login

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│LoginForm │────▶│ api.login│────▶│ Backend  │────▶│Set-Cookie│
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                      ┌─────────────────────────────────┘
                      ▼
              ┌──────────────┐
              │   Response   │
              │  { user }    │
              └──────┬───────┘
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│setUser() │  │localStorage│  │ Redirect │
│          │  │.setItem()  │  │ to home  │
└──────────┘  └──────────┘  └──────────┘
```

---

## Component Interaction

### Profile Page Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ProfilePage                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      ProfileCard                               │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │  │
│  │  │ Avatar  │  │ Cover   │  │ Info    │  │ Edit    │          │  │
│  │  │ Upload  │  │ Upload  │  │ Display │  │ Dialog  │          │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      ProfileAbout                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Bio text / Edit mode                                    │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      ProfileSkills                             │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                       │  │
│  │  │ Skill 1 │  │ Skill 2 │  │ + Add   │                       │  │
│  │  └─────────┘  └─────────┘  └─────────┘                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Messages Page Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                       MessagesContainer                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌────────────────────────────────────────┐  │
│  │ ConversationList │  │              ChatBox                    │  │
│  │                  │  │                                         │  │
│  │ ┌──────────────┐ │  │  ┌─────────────────────────────────┐   │  │
│  │ │ SearchBar    │ │  │  │          ChatHeader             │   │  │
│  │ └──────────────┘ │  │  │  [Avatar] [Name] [Status]       │   │  │
│  │                  │  │  └─────────────────────────────────┘   │  │
│  │ ┌──────────────┐ │  │                                         │  │
│  │ │Conversation 1│ │  │  ┌─────────────────────────────────┐   │  │
│  │ │  - LastMsg   │ │  │  │        Message List             │   │  │
│  │ │  - Time      │ │  │  │  ┌─────────────────────────┐   │   │  │
│  │ └──────────────┘ │  │  │  │    MessageBubble        │   │   │  │
│  │                  │  │  │  │    [Content] [Time]     │   │   │  │
│  │ ┌──────────────┐ │  │  │  └─────────────────────────┘   │   │  │
│  │ │Conversation 2│ │  │  │                                 │   │  │
│  │ └──────────────┘ │  │  │  ┌─────────────────────────┐   │   │  │
│  │                  │  │  │  │    MessageBubble        │   │   │  │
│  │ ┌──────────────┐ │  │  │  └─────────────────────────┘   │   │  │
│  │ │Conversation 3│ │  │  └─────────────────────────────────┘   │  │
│  │ └──────────────┘ │  │                                         │  │
│  │                  │  │  ┌─────────────────────────────────┐   │  │
│  └──────────────────┘  │  │          ChatInput              │   │  │
│                        │  │  [Input] [Emoji] [File] [Send]  │   │  │
│                        │  └─────────────────────────────────┘   │  │
│                        └────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Job Detail Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JobDetailPage                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │         JobDetail              │  │    JobDetailSidebar      │  │
│  │                                │  │                          │  │
│  │  ┌──────────────────────────┐  │  │  ┌────────────────────┐  │  │
│  │  │    JobDetailHeader       │  │  │  │   Employer Info    │  │  │
│  │  │  [Title] [Status]        │  │  │  │   [Avatar] [Name]  │  │  │
│  │  │  [Budget] [Deadline]     │  │  │  │   [Trust Score]    │  │  │
│  │  └──────────────────────────┘  │  │  └────────────────────┘  │  │
│  │                                │  │                          │  │
│  │  ┌──────────────────────────┐  │  │  ┌────────────────────┐  │  │
│  │  │    Description           │  │  │  │   Action Buttons   │  │  │
│  │  │    [Content]             │  │  │  │   [Apply] [Save]   │  │  │
│  │  └──────────────────────────┘  │  │  │   [Chat]           │  │  │
│  │                                │  │  └────────────────────┘  │  │
│  │  ┌──────────────────────────┐  │  │                          │  │
│  │  │    Requirements          │  │  │  ┌────────────────────┐  │  │
│  │  │    [List items]          │  │  │  │   Similar Jobs     │  │  │
│  │  └──────────────────────────┘  │  │  │   [Job cards...]   │  │  │
│  │                                │  │  └────────────────────┘  │  │
│  │  ┌──────────────────────────┐  │  │                          │  │
│  │  │    Skills Required       │  │  └──────────────────────────┘  │
│  │  │    [Skill badges]        │  │                                │
│  │  └──────────────────────────┘  │                                │
│  │                                │                                │
│  └────────────────────────────────┘                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      API Request Flow                                │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  Component   │
                    │  calls API   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   api.ts     │
                    │  request()   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Success  │ │ 401 Error│ │Other Error
        │ (2xx)    │ │          │ │          │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │
             │            ▼            │
             │    ┌──────────────┐     │
             │    │handleUnauthorized  │
             │    └──────┬───────┘     │
             │           │             │
             │           ▼             │
             │    ┌──────────────┐     │
             │    │ Check if user│     │
             │    │ was logged in│     │
             │    └──────┬───────┘     │
             │           │             │
             │     ┌─────┴─────┐       │
             │     ▼           ▼       │
             │  ┌──────┐  ┌──────┐     │
             │  │ Yes  │  │  No  │     │
             │  └──┬───┘  └──┬───┘     │
             │     │         │         │
             │     ▼         │         │
             │  clearAuth    │         │
             │  redirect     │         │
             │  to /login    │         │
             │               │         │
             ▼               ▼         ▼
        ┌─────────────────────────────────┐
        │       Return response           │
        │       to component              │
        └─────────────────────────────────┘
```

---

## Common Issues

### CORS Errors
- Kiểm tra `NEXT_PUBLIC_API_URL` đúng chưa
- Backend phải cho phép origin của frontend

### Cookie không gửi được (Production)
- Backend cần set `COOKIE_SECURE=true` và `COOKIE_SAME_SITE=None`
- Frontend phải dùng HTTPS

### Hydration Mismatch
- Wrap client-only code trong `useEffect`
- Sử dụng `isHydrated` từ AuthContext

### 401 Unauthorized sau khi login
- Cookie không được set đúng
- Kiểm tra cross-origin cookie settings

## Best Practices

1. **Loading States**: Luôn hiển thị loading skeleton
2. **Error Handling**: Catch và hiển thị lỗi user-friendly
3. **Optimistic Updates**: Update UI trước khi API respond
4. **Responsive Design**: Mobile-first approach
5. **Accessibility**: Sử dụng semantic HTML và ARIA labels

## License

MIT License
