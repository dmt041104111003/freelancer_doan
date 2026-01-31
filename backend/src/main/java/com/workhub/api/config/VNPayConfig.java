package com.workhub.api.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Configuration
@Getter
public class VNPayConfig {

    private static final Logger log = LoggerFactory.getLogger(VNPayConfig.class);

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String paymentUrl;

    @Value("${app.payment.vnpay-return-url}")
    private String returnUrl;

    public String createSecureHash(Map<String, String> params) {
        String hashData = buildHashDataFromParams(params);
        String secureHash = hmacSha512(hashSecret, hashData);
        log.info("VNPAY createSecureHash hashData=[{}] secureHash=[{}]", hashData, secureHash);
        return secureHash;
    }

    public String buildHashDataFromParams(Map<String, String> params) {
        TreeMap<String, String> sorted = new TreeMap<>(params);
        return sorted.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .map(e -> e.getKey() + "=" + urlEncode(e.getValue()))
                .collect(Collectors.joining("&"));
    }

    public String buildSortedQueryString(Map<String, String> params) {
        TreeMap<String, String> sorted = new TreeMap<>(params);
        return sorted.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .map(e -> urlEncode(e.getKey()) + "=" + urlEncode(e.getValue()))
                .collect(Collectors.joining("&"));
    }

    public boolean verifySecureHash(String hashData, String secureHash) {
        String calculated = hmacSha512(hashSecret, hashData);
        boolean ok = calculated.equalsIgnoreCase(secureHash);
        log.info("VNPAY verifySecureHash hashData=[{}] received=[{}] calculated=[{}] match={}", hashData, secureHash, calculated, ok);
        return ok;
    }

    public String buildHashDataFromRequest(HttpServletRequest request) {
        TreeMap<String, String> sorted = new TreeMap<>();
        request.getParameterMap().forEach((key, values) -> {
            if (key.startsWith("vnp_") && !"vnp_SecureHash".equals(key) && !"vnp_SecureHashType".equals(key)) {
                if (values != null && values.length > 0) {
                    sorted.put(key, values[0]);
                }
            }
        });
        return sorted.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .map(e -> e.getKey() + "=" + urlEncode(e.getValue()))
                .collect(Collectors.joining("&"));
    }

    private static String urlEncode(String s) {
        if (s == null) return "";
        try {
            return java.net.URLEncoder.encode(s, StandardCharsets.US_ASCII.name());
        } catch (Exception e) {
            return s;
        }
    }

    private static String hmacSha512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec spec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(spec);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return toHexString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo HMAC SHA512", e);
        }
    }

    private static String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }
}
