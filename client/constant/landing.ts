export interface Province {
  id: number;
  name: string;
  districts: string[];
}

export interface JobCategory {
  id: number;
  name: string;
  popular: string[];
  subCategories: {
    name: string;
    tags: string[];
  }[];
}

export interface BannerSlide {
  id: number;
  src: string;
  alt: string;
}

export interface Stat {
  number: string;
  title: string;
  desc: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  jobs: number;
  iconType: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
}

// ==================== HERO SECTION ====================
export interface BlogPost {
  id: number;
  title: string;
  highlightText?: string;
  date: string;
  views: number;
  image: string;
  slug: string;
}

export const featuredPost: BlogPost = {
  id: 1,
  title: "BÍ QUYẾT TRỞ THÀNH FREELANCER THÀNH CÔNG NĂM 2024",
  highlightText: "BÍ QUYẾT TRỞ THÀNH\nFREELANCER\nTHÀNH CÔNG",
  date: "Tháng Một 10, 2024",
  views: 8520,
  image: "/landing/slide1.png",
  slug: "/blog/bi-quyet-tro-thanh-freelancer-thanh-cong",
};

export const sidePosts: BlogPost[] = [
  {
    id: 2,
    title: "CÁCH ĐỊNH GIÁ DỊCH VỤ FREELANCE CỦA BẠN",
    date: "Tháng Một 5, 2024",
    views: 5230,
    image: "/landing/slide2.png",
    slug: "/blog/cach-dinh-gia-dich-vu-freelance",
  },
  {
    id: 3,
    title: "XÂY DỰNG PORTFOLIO ẤN TƯỢNG CHO FREELANCER",
    date: "Tháng Mười Hai 28, 2023",
    views: 4815,
    image: "/landing/slide3.png",
    slug: "/blog/xay-dung-portfolio-an-tuong",
  },
  {
    id: 4,
    title: "QUẢN LÝ THỜI GIAN HIỆU QUẢ KHI LÀM VIỆC TỰ DO",
    date: "Tháng Mười Hai 20, 2023",
    views: 6142,
    image: "/landing/slide4.png",
    slug: "/blog/quan-ly-thoi-gian-hieu-qua",
  },
  {
    id: 5,
    title: "TOP 10 KỸ NĂNG FREELANCER CẦN CÓ TRONG 2024",
    date: "Tháng Mười Hai 15, 2023",
    views: 7890,
    image: "/landing/slide1.png",
    slug: "/blog/top-10-ky-nang-freelancer",
  },
];

// ==================== APP DOWNLOAD / PLATFORM INFO ====================
export interface PlatformFeature {
  title: string;
  items: string[];
}

export const platformFeatures: PlatformFeature[] = [
  {
    title: "Dành cho Freelancer",
    items: [
      "Kết nối với hàng nghìn dự án mới mỗi ngày",
      "Thanh toán an toàn qua hệ thống escrow",
      "Xây dựng profile chuyên nghiệp miễn phí",
    ],
  },
  {
    title: "Dành cho Doanh nghiệp",
    items: [
      "Tìm kiếm freelancer phù hợp trong vài phút",
      "Quản lý dự án và tiến độ dễ dàng",
      "Đảm bảo chất lượng với hệ thống đánh giá",
    ],
  },
  {
    title: "Ưu điểm Freelancer.vn",
    items: [
      "18M+ freelancer đã xác minh toàn cầu",
      "Hỗ trợ 24/7 bằng tiếng Việt",
      "Bảo mật dữ liệu theo chuẩn quốc tế",
    ],
  },
];

// ==================== HOTLINE / SUPPORT ====================
export interface SupportInfo {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export const supportInfo: SupportInfo = {
  title: "Bạn cần hỗ trợ?",
  subtitle: "Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7. Hãy liên hệ ngay!",
  buttonText: "LIÊN HỆ HỖ TRỢ",
  buttonLink: "/contact",
};

// ==================== PARTNERS / CLIENTS ====================
export interface Client {
  id: number;
  name: string;
  logo: string;
}

export const clients: Client[] = [
  { id: 1, name: "FPT Software", logo: "/logo.png" },
  { id: 2, name: "VNG Corporation", logo: "/1-sao.png" },
  { id: 3, name: "Viettel", logo: "/2-sao.png" },
  { id: 4, name: "VNPT", logo: "/3-sao.png" },
  { id: 5, name: "Tiki", logo: "/logo.png" },
  { id: 6, name: "Shopee", logo: "/1-sao.png" },
  { id: 7, name: "Sendo", logo: "/2-sao.png" },
  { id: 8, name: "MoMo", logo: "/3-sao.png" },
  { id: 9, name: "VinGroup", logo: "/logo.png" },
  { id: 10, name: "TH True Milk", logo: "/1-sao.png" },
  { id: 11, name: "Masan Group", logo: "/2-sao.png" },
  { id: 12, name: "Techcombank", logo: "/3-sao.png" },
];

export const partnersHeader = {
  subtitle: "Được tin tưởng bởi",
  title: "Doanh nghiệp hàng đầu Việt Nam",
};

// ==================== PRODUCTS / SERVICES ====================
export interface FreelanceService {
  id: number;
  category: string;
  title: string;
  freelancerCount: number;
}

export const freelanceServices: FreelanceService[] = [
  { id: 1, category: "Lập trình", title: "Website & Ứng dụng", freelancerCount: 5200 },
  { id: 2, category: "Thiết kế", title: "Đồ họa & UI/UX", freelancerCount: 3800 },
  { id: 3, category: "Marketing", title: "SEO & Quảng cáo", freelancerCount: 2100 },
  { id: 4, category: "Viết lách", title: "Content & Copywriting", freelancerCount: 1950 },
  { id: 5, category: "Video", title: "Chỉnh sửa & Animation", freelancerCount: 1200 },
  { id: 6, category: "Dịch thuật", title: "Đa ngôn ngữ", freelancerCount: 890 },
  { id: 7, category: "Tư vấn", title: "Kinh doanh & Pháp lý", freelancerCount: 650 },
  { id: 8, category: "Kế toán", title: "Tài chính & Thuế", freelancerCount: 720 },
];

export const servicesHeader = {
  subtitle: "Dịch vụ Freelancer",
  title: "Tìm chuyên gia phù hợp",
};

// ==================== FOOTER ====================
export interface Office {
  id: number;
  companyName: string;
  officeType: string;
  address: string;
  phones: { label: string; number: string }[];
  email: string;
}

export const offices: Office[] = [
  {
    id: 1,
    companyName: "CÔNG TY TNHH FREELANCER",
    officeType: "TRỤ SỞ CHÍNH",
    address: "Số 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
    phones: [
      { label: "Hotline", number: "(+84) 123 456 789" },
      { label: "Hỗ trợ", number: "(+84) 987 654 321" },
    ],
    email: "contact@example.com",
  },
  {
    id: 2,
    companyName: "CÔNG TY TNHH FREELANCER",
    officeType: "CHI NHÁNH HÀ NỘI",
    address: "Số 456 Đường DEF, Quận GHI, Hà Nội",
    phones: [
      { label: "Tel", number: "(+84) 111 222 333" },
    ],
    email: "hanoi@example.com",
  },
  {
    id: 3,
    companyName: "FREELANCER PTE. LTD.",
    officeType: "INTERNATIONAL",
    address: "123 Demo Street, Demo City, Demo Country",
    phones: [],
    email: "global@example.com",
  },
];

export const footerCopyright = "Copyright © CÔNG TY TNHH FREELANCER. All rights reserved.";

// ==================== EXISTING DATA ====================
export const jobCategories: JobCategory[] = [
  { 
    id: 1, 
    name: "Phát triển & CNTT",
    popular: [
      "Lập trình viên Web", "Lập trình Mobile", "Lập trình Backend", 
      "Lập trình Frontend", "Lập trình Full-stack", "DevOps Engineer",
      "Kỹ sư QA/Testing", "Lập trình Game", "Blockchain Developer", "Kỹ sư Java"
    ],
    subCategories: [
      { name: "Web & Mobile", tags: ["Lập trình viên ReactJS", "Lập trình viên Vue.js", "Lập trình iOS", "Lập trình Android", "Lập trình Flutter"] },
      { name: "Hệ thống & Cloud", tags: ["AWS Engineer", "Azure Specialist", "Docker Expert", "Kubernetes Admin", "System Administrator"] },
    ]
  },
  { 
    id: 2, 
    name: "Thiết kế & Sáng tạo",
    popular: [
      "Thiết kế Logo", "Thiết kế UI/UX", "Thiết kế Đồ họa",
      "Thiết kế Banner", "Thiết kế Infographic", "Thiết kế Packaging",
      "Thiết kế Social Media", "Brand Designer", "Motion Designer", "3D Designer"
    ],
    subCategories: [
      { name: "Video & Âm thanh", tags: ["Biên tập video", "Motion Graphics", "Sound Designer", "Voiceover Artist", "Video Editor"] },
      { name: "Thiết kế & Minh họa", tags: ["Illustrator", "Character Designer", "Icon Designer", "Print Designer", "Art Director"] },
    ]
  },
  { 
    id: 3, 
    name: "Dịch vụ AI",
    popular: [
      "AI/ML Engineer", "Data Scientist", "NLP Specialist",
      "Computer Vision", "AI Chatbot Developer", "Prompt Engineer",
      "Deep Learning Expert", "Data Analyst", "MLOps Engineer", "AI Researcher"
    ],
    subCategories: [
      { name: "Framework & Tools", tags: ["TensorFlow Expert", "PyTorch Developer", "Scikit-Learn Specialist", "OpenCV Developer", "Hugging Face"] },
      { name: "Chuyên sâu", tags: ["Reinforcement Learning", "GANs Specialist", "Recommender Systems", "Time Series Analysis", "AutoML Expert"] },
    ]
  },
  { 
    id: 4, 
    name: "Bán hàng & Marketing",
    popular: [
      "Digital Marketing", "SEO Specialist", "Google Ads",
      "Facebook Ads", "Content Marketing", "Email Marketing",
      "Social Media Manager", "Growth Hacker", "Affiliate Marketing", "Influencer Marketing"
    ],
    subCategories: [
      { name: "Quảng cáo", tags: ["PPC Specialist", "Display Ads", "Video Ads", "TikTok Ads", "LinkedIn Ads"] },
      { name: "Chiến lược", tags: ["Marketing Strategy", "Brand Strategy", "Market Research", "Competitor Analysis", "Customer Insights"] },
    ]
  },
  { 
    id: 5, 
    name: "Viết lách & Dịch thuật",
    popular: [
      "Content Writer", "Copywriter", "Technical Writer",
      "Blog Writer", "SEO Writer", "Ghostwriter",
      "Script Writer", "Editor", "Proofreader", "Translator"
    ],
    subCategories: [
      { name: "Dịch thuật", tags: ["Dịch Anh-Việt", "Dịch Nhật-Việt", "Dịch Hàn-Việt", "Dịch Trung-Việt", "Phiên dịch"] },
      { name: "Viết chuyên ngành", tags: ["Medical Writer", "Legal Writer", "Finance Writer", "Tech Writer", "Academic Writer"] },
    ]
  },
  { 
    id: 6, 
    name: "Hành chính & Hỗ trợ",
    popular: [
      "Virtual Assistant", "Data Entry", "Customer Support",
      "Admin Assistant", "Bookkeeping", "Research Assistant",
      "Project Coordinator", "Executive Assistant", "Receptionist", "Office Manager"
    ],
    subCategories: [
      { name: "Quản trị", tags: ["Calendar Management", "Email Management", "Travel Booking", "Meeting Coordinator", "CRM Specialist"] },
      { name: "Hỗ trợ", tags: ["Live Chat Support", "Phone Support", "Technical Support", "Help Desk", "Community Manager"] },
    ]
  },
  { 
    id: 7, 
    name: "Tài chính & Kế toán",
    popular: [
      "Kế toán viên", "CFO Consultant", "Tax Consultant",
      "Financial Analyst", "Auditor", "Bookkeeper",
      "Payroll Specialist", "Budget Analyst", "Investment Advisor", "Risk Analyst"
    ],
    subCategories: [
      { name: "Tư vấn & Phân tích", tags: ["Business Analyst", "Financial Modeling", "Valuation Expert", "Due Diligence", "M&A Advisor"] },
      { name: "Kế toán chuyên môn", tags: ["QuickBooks Expert", "Xero Specialist", "SAP Consultant", "MISA Expert", "Fast Accounting"] },
    ]
  },
  { 
    id: 8, 
    name: "Pháp lý",
    popular: [
      "Luật sư tư vấn", "Soạn thảo hợp đồng", "Tư vấn pháp lý",
      "Luật sư doanh nghiệp", "IP Lawyer", "Contract Specialist",
      "Compliance Officer", "Legal Researcher", "Paralegal", "Notary"
    ],
    subCategories: [
      { name: "Luật chuyên ngành", tags: ["Luật Thương mại", "Luật Lao động", "Luật Đầu tư", "Luật Sở hữu trí tuệ", "Luật Bất động sản"] },
      { name: "Tố tụng & Tranh chấp", tags: ["Luật sư Tranh tụng", "Hòa giải viên", "Trọng tài viên", "Luật sư Hình sự", "Luật sư Dân sự"] },
    ]
  },
  { 
    id: 9, 
    name: "Nhân sự & Đào tạo",
    popular: [
      "HR Consultant", "Recruiter", "Trainer",
      "L&D Specialist", "Talent Acquisition", "HR Business Partner",
      "Compensation & Benefits", "HR Analytics", "Employer Branding", "Onboarding Specialist"
    ],
    subCategories: [
      { name: "Tuyển dụng", tags: ["Tech Recruiter", "Executive Search", "Headhunter", "Campus Recruiter", "Sourcing Specialist"] },
      { name: "Đào tạo", tags: ["Corporate Trainer", "E-Learning Developer", "Instructional Designer", "Leadership Coach", "Sales Trainer"] },
    ]
  },
  { 
    id: 10, 
    name: "Kỹ thuật & Kiến trúc",
    popular: [
      "Kiến trúc sư", "Kỹ sư xây dựng", "Interior Designer",
      "AutoCAD Specialist", "3D Modeler", "Structural Engineer",
      "MEP Engineer", "Landscape Designer", "BIM Specialist", "Surveyor"
    ],
    subCategories: [
      { name: "Kiến trúc", tags: ["Residential Architect", "Commercial Architect", "Urban Planner", "Conservation Architect", "Sustainable Design"] },
      { name: "Kỹ thuật", tags: ["Civil Engineer", "Electrical Engineer", "Mechanical Engineer", "HVAC Engineer", "Fire Safety Engineer"] },
    ]
  },
];

export const provinces: Province[] = [
  { id: 1, name: "Hà Nội", districts: ["Ba Đình", "Hoàn Kiếm", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng"] },
  { id: 2, name: "Hồ Chí Minh", districts: ["Quận 1", "Quận 3", "Quận 7", "Bình Thạnh", "Thủ Đức"] },
  { id: 3, name: "Bình Dương", districts: ["Thủ Dầu Một", "Dĩ An", "Thuận An", "Tân Uyên"] },
  { id: 4, name: "Bắc Ninh", districts: ["TP Bắc Ninh", "Từ Sơn", "Yên Phong", "Quế Võ"] },
  { id: 5, name: "Đồng Nai", districts: ["Biên Hòa", "Long Khánh", "Nhơn Trạch", "Long Thành"] },
  { id: 6, name: "Hưng Yên", districts: ["TP Hưng Yên", "Văn Lâm", "Văn Giang", "Mỹ Hào"] },
  { id: 7, name: "Hải Dương", districts: ["TP Hải Dương", "Chí Linh", "Kinh Môn", "Nam Sách"] },
  { id: 8, name: "Đà Nẵng", districts: ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn"] },
  { id: 9, name: "Cần Thơ", districts: ["Ninh Kiều", "Cái Răng", "Bình Thủy", "Ô Môn"] },
  { id: 10, name: "Hải Phòng", districts: ["Hồng Bàng", "Lê Chân", "Ngô Quyền", "Kiến An"] },
];

export const bannerSlides: BannerSlide[] = [
  { id: 1, src: "/landing/slide1.png", alt: "Tìm kiếm Freelancer chất lượng" },
  { id: 2, src: "/landing/slide2.png", alt: "Đăng dự án miễn phí" },
  { id: 3, src: "/landing/slide3.png", alt: "Thanh toán an toàn" },
  { id: 4, src: "/landing/slide4.png", alt: "Hỗ trợ 24/7" },
];

export const stats: Stat[] = [
  { 
    number: "18M+", 
    title: "Freelancer đã đăng ký",
    desc: "Tìm kiếm chuyên gia phù hợp với dự án của bạn từ mạng lưới freelancer lớn nhất"
  },
  { 
    number: "8.000+", 
    title: "Kỹ năng chuyên môn",
    desc: "Từ phát triển web, thiết kế đồ họa đến AI, blockchain và nhiều hơn nữa"
  },
  { 
    number: "5M+", 
    title: "Dự án đã hoàn thành",
    desc: "Kết nối khách hàng với freelancer chất lượng cao trên toàn thế giới"
  },
  { 
    number: "4.9/5", 
    title: "Đánh giá trung bình",
    desc: "Hàng triệu khách hàng hài lòng với chất lượng dịch vụ freelancer"
  },
];

export const productCategories: ProductCategory[] = [
  { id: 1, name: "Phát triển & CNTT", jobs: 7938, iconType: "dev" },
  { id: 2, name: "Thiết kế & Sáng tạo", jobs: 5640, iconType: "design" },
  { id: 3, name: "Dịch vụ AI", jobs: 2005, iconType: "ai" },
  { id: 4, name: "Bán hàng & Marketing", jobs: 2465, iconType: "marketing" },
  { id: 5, name: "Viết lách & Dịch thuật", jobs: 1892, iconType: "writing" },
  { id: 6, name: "Hành chính & Hỗ trợ", jobs: 1283, iconType: "admin" },
  { id: 7, name: "Tài chính & Kế toán", jobs: 4572, iconType: "finance" },
  { id: 8, name: "Pháp lý", jobs: 343, iconType: "legal" },
  { id: 9, name: "Nhân sự & Đào tạo", jobs: 1456, iconType: "hr" },
  { id: 10, name: "Kỹ thuật & Kiến trúc", jobs: 2134, iconType: "engineering" },
];

export const partners: Partner[] = [
  { id: 1, name: "FPT Software", logo: "/1-sao.png" },
  { id: 2, name: "VNG Corporation", logo: "/2-sao.png" },
  { id: 3, name: "Viettel", logo: "/3-sao.png" },
  { id: 4, name: "Freelancer", logo: "/logo.svg" },
  { id: 5, name: "Tiki", logo: "/1-sao.png" },
  { id: 6, name: "Shopee", logo: "/2-sao.png" },
  { id: 7, name: "MoMo", logo: "/3-sao.png" },
  { id: 8, name: "VinGroup", logo: "/logo.svg" },
];

export const popularKeywords: string[] = [
  "Freelancer lập trình",
  "Thiết kế logo",
  "Content writer",
  "SEO specialist",
  "Video editor",
  "Mobile app developer",
  "UI/UX designer",
  "Social media manager",
  "Virtual assistant",
  "Translator",
  "Data entry",
  "Copywriter",
  "Web developer",
  "Graphic designer",
  "WordPress developer",
  "React developer",
  "Digital marketing",
  "Voiceover artist",
  "Illustrator",
  "Motion graphics",
  "3D modeling",
  "Bookkeeping",
  "Business consultant",
  "Proofreading",
  "Academic writing",
  "Photo editing",
  "Brand identity",
  "Landing page design",
  "Email marketing",
  "Google Ads specialist",
  "Facebook Ads",
  "Python developer",
  "JavaScript developer",
  "iOS developer",
  "Android developer",
  "Backend developer",
  "Frontend developer",
  "Full-stack developer",
  "DevOps engineer",
  "Cloud architect",
];
