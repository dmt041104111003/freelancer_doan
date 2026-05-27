package com.workhub.api.dto.response;

import com.workhub.api.entity.EWalletTransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WalletHistoryResponse {
    private Long id;
    private EWalletTransactionType type;
    private String typeLabel;
    private BigDecimal amount;
    private Integer credits;
    private String description;
    private Long referenceId;
    private String referenceType;
    private String status;
    private String orderUrl;
    private String appTransId;
    private LocalDateTime createdAt;

    public static String getTypeLabel(EWalletTransactionType type) {
        return switch (type) {
            case DEPOSIT -> "Nạp tiền";
            case CREDIT_ADMIN_GRANT -> "Admin cấp credit";
            case CREDIT_DAILY -> "Credit hàng ngày";
            case CREDIT_PURCHASE -> "Mua credit";
            case CREDIT_USED -> "Ứng tuyển";
            case JOB_PAYMENT -> "Thanh toán dự án";
            case DISPUTE_REFUND -> "Hoàn tiền tranh chấp";
            case ESCROW_REFUND -> "Hoàn tiền escrow";
            case JOB_ESCROW -> "Ký quỹ đăng việc";
            case PENALTY_FEE -> "Phí phạt";
            case PENALTY_REFUND -> "Hoàn phí phạt";
        };
    }
}
