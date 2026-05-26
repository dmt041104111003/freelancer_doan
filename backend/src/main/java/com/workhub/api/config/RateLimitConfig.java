package com.workhub.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RateLimitConfig {

    private final InMemoryCache cache;

    @Value("${app.rate-limit.register.capacity}")
    private int registerCapacity;

    @Value("${app.rate-limit.register.refill-duration}")
    private long registerRefillDuration;

    @Value("${app.rate-limit.login.capacity}")
    private int loginCapacity;

    @Value("${app.rate-limit.login.refill-duration}")
    private long loginRefillDuration;

    public boolean isAllowed(String key, int limit, long windowSeconds) {
        String redisKey = "rate:" + key;
        Long count = cache.increment(redisKey, windowSeconds);
        return count <= limit;
    }

    public long getRetryAfter(String key) {
        return cache.ttlSeconds("rate:" + key);
    }

    public boolean isRegisterAllowed(String ip) {
        return isAllowed("register:" + ip, registerCapacity, registerRefillDuration);
    }

    public boolean isLoginAllowed(String ip) {
        return isAllowed("login:" + ip, loginCapacity, loginRefillDuration);
    }

    public boolean isOtpAllowed(String ip) {
        return isAllowed("otp:" + ip, 5, 600);
    }

    public boolean isForgotPasswordAllowed(String ip) {
        return isAllowed("forgot:" + ip, 3, 3600);
    }

    public long getRegisterRetryAfter(String ip) {
        return getRetryAfter("register:" + ip);
    }

    public long getLoginRetryAfter(String ip) {
        return getRetryAfter("login:" + ip);
    }

    public long getOtpRetryAfter(String ip) {
        return getRetryAfter("otp:" + ip);
    }

    public long getForgotPasswordRetryAfter(String ip) {
        return getRetryAfter("forgot:" + ip);
    }
}
