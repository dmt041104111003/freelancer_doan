import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { User } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { saveAuthData } from "@/constant/auth";
import { toast } from "sonner";

export function useProfile() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getProfile();
      if (response.status === "SUCCESS" && response.data) {
        setUser(response.data);
        saveAuthData({ user: response.data });
      }
    } catch (err) {
      setError("Không thể tải thông tin profile");
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.updateProfile(data);
      if (response.status === "SUCCESS" && response.data) {
        setUser(response.data);
        saveAuthData({ user: response.data });
        toast.success("Cập nhật thông tin thành công");
        return true;
      }
      const errorMsg = response.message || "Cập nhật thất bại";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } catch (err) {
      const errorMsg = "Không thể cập nhật profile";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const becomeEmployer = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.becomeEmployer();
      if (response.status === "SUCCESS" && response.data) {
        setUser(response.data);
        saveAuthData({ user: response.data });
        toast.success("Đăng ký thành công! Bạn có thể đăng việc.");
        return true;
      }
      const errorMsg = response.message || "Đăng ký thất bại";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } catch {
      const errorMsg = "Không thể đăng ký";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  return {
    user,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    becomeEmployer,
  };
}
