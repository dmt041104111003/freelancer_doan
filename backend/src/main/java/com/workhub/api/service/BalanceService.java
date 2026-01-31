package com.workhub.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workhub.api.config.VNPayConfig;
import com.workhub.api.config.ZaloPayConfig;
import com.workhub.api.dto.request.DepositBalanceRequest;
import com.workhub.api.dto.request.ZaloPayCallbackRequest;
import com.workhub.api.dto.response.ApiResponse;
import com.workhub.api.dto.response.BalanceDepositResponse;
import com.workhub.api.dto.response.BalanceStatisticsResponse;
import com.workhub.api.entity.BalanceDeposit;
import com.workhub.api.entity.EDepositStatus;
import com.workhub.api.entity.User;
import com.workhub.api.repository.BalanceDepositRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BalanceService {

    private final BalanceDepositRepository balanceDepositRepository;
    private final UserService userService;
    private final ZaloPayConfig zaloPayConfig;
    private final VNPayConfig vnPayConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.payment.test-mode:false}")
    private boolean testMode;

    private static final int PAYMENT_EXPIRY_SECONDS = 900;

    @Transactional
    public ApiResponse<BalanceDepositResponse> createDeposit(Long userId, DepositBalanceRequest req) {
        if (req == null || req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền không hợp lệ");
        }

        User user = userService.getById(userId);
        BigDecimal amount = req.getAmount();
        String gateway = req.getGateway() != null ? req.getGateway().toUpperCase() : "ZALOPAY";

        String appTransId = generateAppTransId(userId);
        String description = "WorkHub - Nap so du " + amount.toPlainString() + " VND";

        BalanceDeposit deposit = BalanceDeposit.builder()
                .appTransId(appTransId)
                .user(user)
                .amount(amount)
                .description(description)
                .status(EDepositStatus.PENDING)
                .expiredAt(LocalDateTime.now().plusSeconds(PAYMENT_EXPIRY_SECONDS))
                .build();

        if ("VNPAY".equals(gateway)) {
            try {
                String paymentUrl = buildVnPayPaymentUrl(appTransId, amount, description, userId);
                deposit.setVnPayInfo(paymentUrl);
            } catch (Exception e) {
                log.error("Lỗi tạo URL VNPAY", e);
                throw new RuntimeException("Lỗi tạo đơn nạp số dư VNPAY: " + e.getMessage());
            }
        } else {
            long appTime = System.currentTimeMillis();
            String redirectUrl = zaloPayConfig.getReturnUrl() + "?type=balance&userId=" + userId;
            String embedData = String.format("{\"redirecturl\":\"%s\",\"type\":\"balance\",\"userId\":%d}", redirectUrl, userId);
            String item = "[]";

            try {
                JsonNode zaloPayResponse = callZaloPayCreateOrder(
                        appTransId,
                        user.getFullName(),
                        appTime,
                        amount.longValue(),
                        description,
                        embedData,
                        item
                );

                int returnCode = zaloPayResponse.get("return_code").asInt();
                if (returnCode == 1) {
                    String orderUrl = zaloPayResponse.has("order_url") ?
                            zaloPayResponse.get("order_url").asText() : null;
                    String qrCode = zaloPayResponse.has("qr_code") ?
                            zaloPayResponse.get("qr_code").asText() : null;
                    String zpTransToken = zaloPayResponse.has("zp_trans_token") ?
                            zaloPayResponse.get("zp_trans_token").asText() : null;
                    deposit.setZaloPayInfo(orderUrl, qrCode, zpTransToken);
                } else {
                    String returnMessage = zaloPayResponse.get("return_message").asText();
                    String subReturnMessage = zaloPayResponse.has("sub_return_message") ?
                            zaloPayResponse.get("sub_return_message").asText() : "";
                    throw new RuntimeException("ZaloPay error: " + returnMessage + " - " + subReturnMessage);
                }
            } catch (Exception e) {
                log.error("Lỗi gọi ZaloPay API", e);
                throw new RuntimeException("Lỗi tạo đơn nạp số dư: " + e.getMessage());
            }
        }

        BalanceDeposit saved = balanceDepositRepository.save(deposit);
        return ApiResponse.success("Tạo đơn nạp số dư thành công", buildDepositResponse(saved));
    }

    private String buildVnPayPaymentUrl(String appTransId, BigDecimal amount, String orderInfo, Long userId) {
        long amountVnd = amount.longValue() * 100;
        String createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String expireDate = LocalDateTime.now().plusMinutes(15).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String returnUrl = vnPayConfig.getReturnUrl() + "?type=balance&userId=" + userId + "&appTransId=" + appTransId;

        Map<String, String> params = new LinkedHashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amountVnd));
        params.put("vnp_CreateDate", createDate);
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_Locale", "vn");
        params.put("vnp_OrderInfo", orderInfo.length() > 255 ? orderInfo.substring(0, 255) : orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_ExpireDate", expireDate);
        params.put("vnp_TxnRef", appTransId);

        String hashData = vnPayConfig.buildHashDataFromParams(params);
        String queryString = vnPayConfig.buildSortedQueryString(params);
        String secureHash = vnPayConfig.createSecureHash(params);
        String fullUrl = vnPayConfig.getPaymentUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;
        log.info("VNPAY buildPaymentUrl appTransId={} amountVnd={} returnUrl={} fullUrl={}", appTransId, amountVnd, returnUrl, fullUrl);
        return fullUrl;
    }

    @Transactional
    public Map<String, Object> handleCallback(ZaloPayCallbackRequest request) {
        Map<String, Object> result = new HashMap<>();

        try {
            String dataStr = request.getData();
            String requestMac = request.getMac();

            if (!testMode && !zaloPayConfig.verifyCallback(dataStr, requestMac)) {
                log.warn("Callback không hợp lệ - MAC không khớp");
                result.put("return_code", -1);
                result.put("return_message", "mac not equal");
                return result;
            }

            ZaloPayCallbackRequest.CallbackData callbackData =
                    objectMapper.readValue(dataStr, ZaloPayCallbackRequest.CallbackData.class);

            String appTransId = callbackData.getAppTransId();
            log.info("Nhận callback nạp balance từ ZaloPay: appTransId={}, zpTransId={}",
                    appTransId, callbackData.getZpTransId());

            BalanceDeposit deposit = balanceDepositRepository.findByAppTransId(appTransId).orElse(null);

            if (deposit == null) {
                log.warn("Không tìm thấy balance deposit với appTransId: {}", appTransId);
                result.put("return_code", 1);
                result.put("return_message", "success");
                return result;
            }

            if (deposit.isPaid()) {
                log.info("Balance deposit đã được xử lý trước đó: {}", appTransId);
                result.put("return_code", 2);
                result.put("return_message", "duplicate");
                return result;
            }

            deposit.markAsPaid(callbackData.getZpTransId(), callbackData.getChannel());

            if (deposit.isPaid()) {
                User user = deposit.getUser();
                user.addBalance(deposit.getAmount());
                userService.save(user);
                log.info("Đã cộng {} vào số dư user {}", deposit.getAmount(), user.getId());
            }

            balanceDepositRepository.save(deposit);

            result.put("return_code", 1);
            result.put("return_message", "success");

        } catch (Exception e) {
            log.error("Lỗi xử lý callback balance", e);
            result.put("return_code", 0);
            result.put("return_message", e.getMessage());
        }

        return result;
    }

    @Transactional
    public ApiResponse<BalanceDepositResponse> queryDepositStatus(String appTransId, Long userId) {
        BalanceDeposit deposit = balanceDepositRepository.findByAppTransId(appTransId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn nạp số dư"));

        if (!deposit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xem đơn này");
        }

        if (deposit.isPending()) {
            try {
                JsonNode queryResult = callZaloPayQuery(appTransId);
                int returnCode = queryResult.get("return_code").asInt();

                if (returnCode == 1) {
                    Long zpTransId = queryResult.has("zp_trans_id") ?
                            queryResult.get("zp_trans_id").asLong() : null;
                    deposit.markAsPaid(zpTransId, null);

                    if (deposit.isPaid()) {
                        User user = deposit.getUser();
                        user.addBalance(deposit.getAmount());
                        userService.save(user);
                        log.info("Đã cộng {} vào số dư user {} (từ query)", deposit.getAmount(), user.getId());
                    }

                    deposit = balanceDepositRepository.save(deposit);
                    log.info("Cập nhật trạng thái từ query: appTransId={}, status=PAID", appTransId);
                } else if (returnCode == 2) {
                    deposit.markAsCancelled();
                    deposit = balanceDepositRepository.save(deposit);
                }

            } catch (Exception e) {
                log.error("Lỗi query ZaloPay", e);
            }
        }

        return ApiResponse.success("Thành công", buildDepositResponse(deposit));
    }

    @Transactional
    public Map<String, Object> handleVnPayIpn(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            Enumeration<String> names = request.getParameterNames();
            Map<String, String> allParams = new HashMap<>();
            while (names.hasMoreElements()) {
                String name = names.nextElement();
                allParams.put(name, request.getParameter(name));
            }
            log.info("VNPAY IPN request params={}", allParams);

            String vnpSecureHash = request.getParameter("vnp_SecureHash");
            if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
                log.warn("VNPAY IPN missing vnp_SecureHash params={}", allParams);
                result.put("RspCode", "97");
                result.put("Message", "Invalid signature");
                return result;
            }
            String hashData = vnPayConfig.buildHashDataFromRequest(request);
            log.info("VNPAY IPN hashData=[{}] vnp_SecureHash=[{}]", hashData, vnpSecureHash);
            if (!vnPayConfig.verifySecureHash(hashData, vnpSecureHash)) {
                log.warn("VNPAY IPN chu ky khong hop le hashData=[{}] params={}", hashData, allParams);
                result.put("RspCode", "97");
                result.put("Message", "Invalid signature");
                return result;
            }
            String appTransId = request.getParameter("vnp_TxnRef");
            String vnpTransactionNo = request.getParameter("vnp_TransactionNo");
            String vnpResponseCode = request.getParameter("vnp_ResponseCode");
            String vnpTransactionStatus = request.getParameter("vnp_TransactionStatus");
            String vnpAmount = request.getParameter("vnp_Amount");

            log.info("VNPAY IPN: appTransId={}, vnpTransNo={}, responseCode={}", appTransId, vnpTransactionNo, vnpResponseCode);

            BalanceDeposit deposit = balanceDepositRepository.findByAppTransId(appTransId).orElse(null);
            if (deposit == null) {
                result.put("RspCode", "01");
                result.put("Message", "Order not found");
                return result;
            }
            if (deposit.isPaid()) {
                result.put("RspCode", "02");
                result.put("Message", "Order already confirmed");
                return result;
            }
            long amountExpected = deposit.getAmount().longValue() * 100;
            long amountReceived = Long.parseLong(vnpAmount != null ? vnpAmount : "0");
            if (amountReceived != amountExpected) {
                result.put("RspCode", "04");
                result.put("Message", "invalid amount");
                return result;
            }
            if ("00".equals(vnpResponseCode) || "00".equals(vnpTransactionStatus)) {
                deposit.markAsPaidVnPay(vnpTransactionNo);
                User user = deposit.getUser();
                user.addBalance(deposit.getAmount());
                userService.save(user);
                balanceDepositRepository.save(deposit);
                log.info("VNPAY IPN - Da cong {} vao so du user {}", deposit.getAmount(), user.getId());
            }
            result.put("RspCode", "00");
            result.put("Message", "Confirm Success");
        } catch (Exception e) {
            log.error("Lỗi xử lý VNPAY IPN", e);
            result.put("RspCode", "99");
            result.put("Message", "Unknow error");
        }
        return result;
    }

    @Transactional
    public ApiResponse<BalanceDepositResponse> confirmVnPayReturn(HttpServletRequest request, Long userId) {
        String vnpSecureHash = request.getParameter("vnp_SecureHash");
        if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
            throw new RuntimeException("Thiếu chữ ký VNPAY");
        }
        String hashData = vnPayConfig.buildHashDataFromRequest(request);
        if (!vnPayConfig.verifySecureHash(hashData, vnpSecureHash)) {
            throw new RuntimeException("Chữ ký VNPAY không hợp lệ");
        }
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");
        String vnpTransactionStatus = request.getParameter("vnp_TransactionStatus");
        if (!"00".equals(vnpResponseCode) && !"00".equals(vnpTransactionStatus)) {
            BalanceDeposit d = balanceDepositRepository.findByAppTransId(request.getParameter("vnp_TxnRef")).orElse(null);
            return ApiResponse.success("Giao dịch không thành công", d != null ? buildDepositResponse(d) : null);
        }
        String appTransId = request.getParameter("vnp_TxnRef");
        String vnpTransactionNo = request.getParameter("vnp_TransactionNo");
        String vnpAmount = request.getParameter("vnp_Amount");
        BalanceDeposit deposit = balanceDepositRepository.findByAppTransId(appTransId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn nạp tiền"));
        if (!deposit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xác nhận giao dịch này");
        }
        if (deposit.isPaid()) {
            return ApiResponse.success("Đã xác nhận trước đó", buildDepositResponse(deposit));
        }
        long amountExpected = deposit.getAmount().longValue() * 100;
        long amountReceived = Long.parseLong(vnpAmount != null ? vnpAmount : "0");
        if (amountReceived != amountExpected) {
            throw new RuntimeException("Số tiền không khớp");
        }
        deposit.markAsPaidVnPay(vnpTransactionNo);
        User user = deposit.getUser();
        user.addBalance(deposit.getAmount());
        userService.save(user);
        balanceDepositRepository.save(deposit);
        log.info("VNPAY confirm-return: da cong {} vao so du user {}", deposit.getAmount(), user.getId());
        return ApiResponse.success("Nạp tiền thành công", buildDepositResponse(deposit));
    }

    public ApiResponse<Page<BalanceDepositResponse>> getMyDeposits(Long userId, EDepositStatus status,
                                                                    int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<BalanceDeposit> deposits;
        if (status != null) {
            deposits = balanceDepositRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            deposits = balanceDepositRepository.findByUserId(userId, pageable);
        }

        Page<BalanceDepositResponse> response = deposits.map(this::buildDepositResponse);
        return ApiResponse.success("Thành công", response);
    }

    public ApiResponse<Page<BalanceDepositResponse>> getAllDeposits(EDepositStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<BalanceDeposit> deposits;
        if (status != null) {
            deposits = balanceDepositRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            deposits = balanceDepositRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        Page<BalanceDepositResponse> response = deposits.map(this::buildDepositResponse);
        return ApiResponse.success("Thành công", response);
    }

    public ApiResponse<BalanceStatisticsResponse> getDepositStatistics() {
        BigDecimal totalDeposited = balanceDepositRepository.sumAmountByStatus(EDepositStatus.PAID);

        Long totalTransactions = balanceDepositRepository.count();
        Long paidTransactions = balanceDepositRepository.countByStatus(EDepositStatus.PAID);
        Long pendingTransactions = balanceDepositRepository.countByStatus(EDepositStatus.PENDING);
        Long cancelledTransactions = balanceDepositRepository.countByStatus(EDepositStatus.CANCELLED);
        Long expiredTransactions = balanceDepositRepository.countByStatus(EDepositStatus.EXPIRED);

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        BigDecimal todayDeposited = balanceDepositRepository.sumAmountByStatusAndPaidAtAfter(
                EDepositStatus.PAID, startOfToday);
        Long todayTransactions = balanceDepositRepository.countByStatusAndPaidAtAfter(
                EDepositStatus.PAID, startOfToday);

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal monthDeposited = balanceDepositRepository.sumAmountByStatusAndPaidAtAfter(
                EDepositStatus.PAID, startOfMonth);
        Long monthTransactions = balanceDepositRepository.countByStatusAndPaidAtAfter(
                EDepositStatus.PAID, startOfMonth);

        BalanceStatisticsResponse statistics = BalanceStatisticsResponse.builder()
                .totalDeposited(totalDeposited)
                .totalTransactions(totalTransactions)
                .paidTransactions(paidTransactions)
                .pendingTransactions(pendingTransactions)
                .cancelledTransactions(cancelledTransactions)
                .expiredTransactions(expiredTransactions)
                .todayDeposited(todayDeposited)
                .todayTransactions(todayTransactions)
                .monthDeposited(monthDeposited)
                .monthTransactions(monthTransactions)
                .build();

        return ApiResponse.success("Lấy thống kê nạp số dư thành công", statistics);
    }

    private JsonNode callZaloPayCreateOrder(String appTransId, String appUser, long appTime,
                                            long amount, String description,
                                            String embedData, String item) throws Exception {
        String url = zaloPayConfig.getEndpoint() + "/create";

        String mac = zaloPayConfig.createOrderMac(appTransId, appUser, amount, appTime, embedData, item);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("app_id", zaloPayConfig.getAppId());
        params.add("app_user", appUser);
        params.add("app_trans_id", appTransId);
        params.add("app_time", String.valueOf(appTime));
        params.add("amount", String.valueOf(amount));
        params.add("description", description);
        params.add("embed_data", embedData);
        params.add("item", item);
        params.add("bank_code", "");
        params.add("expire_duration_seconds", String.valueOf(PAYMENT_EXPIRY_SECONDS));
        params.add("callback_url", zaloPayConfig.getEndpoint().replace("openapi", "callback"));
        params.add("mac", mac);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        log.debug("ZaloPay create order response: {}", response.getBody());
        return objectMapper.readTree(response.getBody());
    }

    private JsonNode callZaloPayQuery(String appTransId) throws Exception {
        String url = zaloPayConfig.getEndpoint() + "/query";

        String mac = zaloPayConfig.createQueryMac(appTransId);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("app_id", zaloPayConfig.getAppId());
        params.add("app_trans_id", appTransId);
        params.add("mac", mac);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        log.debug("ZaloPay query response: {}", response.getBody());
        return objectMapper.readTree(response.getBody());
    }

    private String generateAppTransId(Long userId) {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        int random = ThreadLocalRandom.current().nextInt(100000, 999999);
        return "freelancer_" + userId + "_" + datePrefix + "_" + random;
    }

    private BalanceDepositResponse buildDepositResponse(BalanceDeposit deposit) {
        return BalanceDepositResponse.builder()
                .id(deposit.getId())
                .appTransId(deposit.getAppTransId())
                .zpTransId(deposit.getZpTransId())
                .userId(deposit.getUser().getId())
                .userFullName(deposit.getUser().getFullName())
                .amount(deposit.getAmount())
                .description(deposit.getDescription())
                .orderUrl(deposit.getOrderUrl())
                .qrCode(deposit.getQrCode())
                .zpTransToken(deposit.getZpTransToken())
                .paymentGateway(deposit.getPaymentGateway())
                .status(deposit.getStatus())
                .paymentChannel(deposit.getPaymentChannel())
                .expiredAt(deposit.getExpiredAt())
                .paidAt(deposit.getPaidAt())
                .createdAt(deposit.getCreatedAt())
                .build();
    }
}
