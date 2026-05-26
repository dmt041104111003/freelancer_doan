package com.workhub.api.service;

import com.workhub.api.config.InMemoryCache;
import com.workhub.api.entity.EOtpType;
import com.workhub.api.entity.User;
import com.workhub.api.exception.InvalidOtpException;
import com.workhub.api.exception.OtpExpiredException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final InMemoryCache cache;
    private final EmailService emailService;

    @Value("${app.otp.expiration}")
    private long otpExpiration;

    @Value("${app.otp.max-attempts}")
    private int maxAttempts;

    private static final SecureRandom random = new SecureRandom();

    public void generateAndSendOtp(User user, EOtpType otpType) {
        String otpKey = otpKey(otpType, user.getEmail());
        String attemptsKey = attemptsKey(otpType, user.getEmail());

        cache.delete(otpKey);
        cache.delete(attemptsKey);

        String otpCode = String.format("%06d", random.nextInt(1_000_000));
        long ttlSeconds = otpExpiration / 1000;
        cache.set(otpKey, otpCode, ttlSeconds);

        emailService.sendOtpEmail(user.getEmail(), user.getFullName(), otpCode, otpType.name());
    }

    public void verifyOtp(String email, String otpCode, EOtpType otpType) {
        String otpKey = otpKey(otpType, email);
        String attemptsKey = attemptsKey(otpType, email);

        String storedOtp = cache.getString(otpKey);
        if (storedOtp == null) {
            throw new OtpExpiredException("OTP hết hạn. Vui lòng yêu cầu mã mới.");
        }

        Integer attempts = cache.getInt(attemptsKey);
        if (attempts != null && attempts >= maxAttempts) {
            cache.delete(otpKey);
            cache.delete(attemptsKey);
            throw new InvalidOtpException("Quá số lần thử. Vui lòng yêu cầu mã mới.");
        }

        cache.increment(attemptsKey, otpExpiration / 1000);

        if (!storedOtp.equals(otpCode)) {
            int used = attempts == null ? 1 : attempts + 1;
            int remaining = maxAttempts - used;
            throw new InvalidOtpException("OTP sai. Còn " + remaining + " lần thử.");
        }

        cache.delete(otpKey);
        cache.delete(attemptsKey);
    }

    public void deleteOtp(String email, EOtpType otpType) {
        cache.delete(otpKey(otpType, email));
        cache.delete(attemptsKey(otpType, email));
    }

    public long getOtpExpirationSeconds() {
        return otpExpiration / 1000;
    }

    private static String otpKey(EOtpType type, String email) {
        return "otp:" + type + ":" + email;
    }

    private static String attemptsKey(EOtpType type, String email) {
        return "otp_attempts:" + type + ":" + email;
    }
}
