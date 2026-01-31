"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "./NotificationDropdown";

// Top bar links
const topLinks = [
  { label: "Dành cho Freelancer", href: "/jobs" },
  { label: "Dành cho Doanh nghiệp", href: "/my-posted-jobs/create" },
  { label: "Blog", href: "/blog" },
  { label: "Hỗ trợ", href: "/contact" },
];

// Main navigation
const mainNavItems = [
  { label: "TÌM VIỆC", href: "/jobs" },
  { label: "TÌM FREELANCER", href: "/freelancers" },
  { label: "BLOG", href: "/blog" },
  { label: "CÁCH HOẠT ĐỘNG", href: "/how-it-works" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBecomingEmployer, setIsBecomingEmployer] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { user, isAuthenticated, isHydrated, logout } = useAuth();
  const { becomeEmployer } = useProfile();

  // Fetch unread messages count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getChatCounts();
      if (res.status === "SUCCESS") {
        setUnreadMessagesCount(res.data.unreadMessages);
      }
    } catch (error) {
      console.error("Failed to fetch unread messages count:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (prefix: string) => pathname?.startsWith(prefix);

  const handleBecomeEmployer = async () => {
    setIsBecomingEmployer(true);
    const success = await becomeEmployer();
    setIsBecomingEmployer(false);
    if (success) {
      toast.success("Đăng ký thành công! Bạn có thể đăng việc.");
    } else {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <header className="w-full md:sticky md:top-0 z-40">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-[#1a3a4a] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-end h-8 gap-1">
            {topLinks.map((link, index) => (
              <div key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className="text-xs hover:text-[#04A0EF] transition-colors px-2"
                >
                  {link.label}
                </Link>
                {index < topLinks.length - 1 && (
                  <span className="text-gray-500">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Freelancer"
                  width={50}
                  height={50}
                  className="h-10 md:h-12 w-auto object-contain"
                />
                <div className="hidden sm:block">
                  <p className="text-[#04A0EF] font-bold text-lg md:text-xl">Freelancer</p>
                  <p className="text-gray-500 text-xs">Nền tảng việc làm tự do #1 Việt Nam</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 xl:px-6 py-2 text-sm font-medium tracking-wide transition-colors ${
                    isActive(item.href) || isActivePrefix(item.href)
                      ? "text-[#04A0EF]"
                      : "text-gray-700 hover:text-[#04A0EF]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side - Icons & Auth */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Icon */}
              <div className="hidden md:flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-[#04A0EF] transition-colors">
                  <Icon name="search" size={22} />
                </button>
              </div>

              {/* Auth Section */}
              {!isHydrated ? (
                <div className="w-8 h-8 md:w-[100px] bg-gray-200 rounded animate-pulse" />
              ) : isAuthenticated && user ? (
                <div className="flex items-center gap-1 md:gap-2">
                  {/* Messages - Mobile */}
                  <Link href="/messages" className="relative p-2 md:hidden">
                    <Icon 
                      name="forum" 
                      size={20} 
                      className={`transition-colors ${isActivePrefix("/messages") ? "text-[#04A0EF]" : "text-gray-600"}`}
                    />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                        {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages - Desktop */}
                  <Link href="/messages" className="relative p-2 hidden md:block">
                    <Icon 
                      name="forum" 
                      size={22} 
                      className={`transition-colors ${isActivePrefix("/messages") ? "text-[#04A0EF]" : "text-gray-600 hover:text-[#04A0EF]"}`}
                    />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                      </span>
                    )}
                  </Link>

                  {/* Notifications */}
                  <div className="hidden md:block">
                    <NotificationDropdown />
                  </div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1.5 rounded hover:bg-gray-100 transition-colors outline-none">
                        <Avatar className="h-7 w-7 md:h-8 md:w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                          <AvatarFallback className="bg-[#04A0EF] text-white text-xs md:text-sm">
                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                          {user.fullName}
                        </span>
                        <Icon name="expand_more" size={16} className="text-gray-400 hidden md:block" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="border-b border-gray-100 pb-2">
                        <p className="truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 font-normal truncate">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <Icon name="person" size={20} />
                          Hồ sơ của tôi
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wallet">
                          <Icon name="account_balance_wallet" size={20} />
                          Ví của tôi
                        </Link>
                      </DropdownMenuItem>
                      {user.roles?.includes("ROLE_FREELANCER") && (
                        <DropdownMenuItem asChild>
                          <Link href="/my-accepted-jobs">
                            <Icon name="work" size={20} />
                            Việc đã nhận
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user.roles?.includes("ROLE_EMPLOYER") ? (
                        <DropdownMenuItem asChild>
                          <Link href="/my-posted-jobs">
                            <Icon name="post_add" size={20} />
                            Việc đã đăng
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={handleBecomeEmployer} disabled={isBecomingEmployer}>
                          <Icon name="add_business" size={20} />
                          {isBecomingEmployer ? "Đang xử lý..." : "Đăng ký bên thuê"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={logout}>
                        <Icon name="logout" size={20} />
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                /* Desktop Auth Buttons */
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-[#04A0EF] border border-[#04A0EF] rounded hover:bg-[#04A0EF] hover:text-white transition-colors"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#04A0EF] rounded hover:bg-[#0380BF] transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700"
              >
                <Icon name={mobileMenuOpen ? "close" : "menu"} size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-white">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Freelancer" width={40} height={40} className="h-8 w-auto" />
              <span className="text-[#04A0EF] font-bold">Freelancer</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-700">
              <Icon name="close" size={24} />
            </button>
          </div>

          {/* Mobile Content */}
          <div className="overflow-y-auto h-[calc(100vh-64px)] pb-20">
            {/* User Info */}
            {isAuthenticated && user && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    <AvatarFallback className="bg-[#04A0EF] text-white">
                      {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Nav */}
            <nav className="py-4">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-6 py-4 text-base font-medium border-b border-gray-100 ${
                    isActive(item.href) || isActivePrefix(item.href)
                      ? "text-[#04A0EF] bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Top Links */}
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Liên kết</p>
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-gray-600 hover:text-[#04A0EF]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            {isAuthenticated && user ? (
              <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Tài khoản</p>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-gray-700">
                  <Icon name="person" size={20} className="text-gray-500" />
                  Hồ sơ của tôi
                </Link>
                <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-gray-700">
                  <Icon name="forum" size={20} className="text-gray-500" />
                  Tin nhắn
                  {unreadMessagesCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>
                <Link href="/wallet" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-gray-700">
                  <Icon name="account_balance_wallet" size={20} className="text-gray-500" />
                  Ví của tôi
                </Link>
                <Link href="/my-accepted-jobs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-gray-700">
                  <Icon name="work" size={20} className="text-gray-500" />
                  Việc đã nhận
                </Link>
                <Link href="/my-posted-jobs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-gray-700">
                  <Icon name="post_add" size={20} className="text-gray-500" />
                  Việc đã đăng
                </Link>
       
              </div>
            ) : (
              <div className="p-6 border-t border-gray-200">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-white bg-[#04A0EF] rounded-lg font-semibold mb-3"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center text-[#04A0EF] border border-[#04A0EF] rounded-lg font-semibold"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
