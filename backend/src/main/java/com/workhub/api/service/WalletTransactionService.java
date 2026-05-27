package com.workhub.api.service;

import com.workhub.api.dto.response.ApiResponse;
import com.workhub.api.dto.response.WalletHistoryResponse;
import com.workhub.api.entity.*;
import com.workhub.api.repository.BalanceDepositRepository;
import com.workhub.api.repository.CreditPurchaseRepository;
import com.workhub.api.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;
    private final BalanceDepositRepository balanceDepositRepository;
    private final CreditPurchaseRepository creditPurchaseRepository;

    @Transactional
    public void logBalance(User user, EWalletTransactionType type, BigDecimal amount,
                           String description, Long referenceId, String referenceType) {
        if (referenceId != null && referenceType != null
                && walletTransactionRepository.existsByReferenceTypeAndReferenceId(referenceType, referenceId)) {
            return;
        }
        walletTransactionRepository.save(WalletTransaction.builder()
                .user(user)
                .type(type)
                .amount(amount)
                .description(description)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build());
    }

    @Transactional
    public void logCredits(User user, EWalletTransactionType type, int credits,
                           String description, Long referenceId, String referenceType) {
        if (referenceId != null && referenceType != null
                && walletTransactionRepository.existsByReferenceTypeAndReferenceId(referenceType, referenceId)) {
            return;
        }
        walletTransactionRepository.save(WalletTransaction.builder()
                .user(user)
                .type(type)
                .credits(credits)
                .description(description)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build());
    }

    public ApiResponse<Page<WalletHistoryResponse>> getMyHistory(Long userId, int page, int size) {
        List<WalletHistoryResponse> items = new ArrayList<>();

        walletTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 500))
                .getContent()
                .forEach(tx -> items.add(toResponse(tx)));

        balanceDepositRepository.findByUserId(userId, PageRequest.of(0, 100)).getContent().forEach(deposit -> {
            if (walletTransactionRepository.existsByReferenceTypeAndReferenceId("DEPOSIT", deposit.getId())) {
                return;
            }
            if (deposit.isPaid()) {
                items.add(WalletHistoryResponse.builder()
                        .id(deposit.getId())
                        .type(EWalletTransactionType.DEPOSIT)
                        .typeLabel(WalletHistoryResponse.getTypeLabel(EWalletTransactionType.DEPOSIT))
                        .amount(deposit.getAmount())
                        .description(deposit.getDescription() != null ? deposit.getDescription() : "Nạp tiền vào ví")
                        .referenceId(deposit.getId())
                        .referenceType("DEPOSIT")
                        .status(deposit.getStatus().name())
                        .appTransId(deposit.getAppTransId())
                        .createdAt(deposit.getPaidAt() != null ? deposit.getPaidAt() : deposit.getCreatedAt())
                        .build());
            } else if (deposit.isPending()) {
                items.add(WalletHistoryResponse.builder()
                        .id(deposit.getId())
                        .type(EWalletTransactionType.DEPOSIT)
                        .typeLabel("Nạp tiền (chờ thanh toán)")
                        .amount(deposit.getAmount())
                        .description(deposit.getDescription())
                        .referenceId(deposit.getId())
                        .referenceType("DEPOSIT")
                        .status(deposit.getStatus().name())
                        .orderUrl(deposit.getOrderUrl())
                        .appTransId(deposit.getAppTransId())
                        .createdAt(deposit.getCreatedAt())
                        .build());
            }
        });

        creditPurchaseRepository.findByUserId(userId, PageRequest.of(0, 100)).getContent().forEach(purchase -> {
            if (!Boolean.TRUE.equals(purchase.getCreditsGranted())) {
                return;
            }
            if (walletTransactionRepository.existsByReferenceTypeAndReferenceId("CREDIT_PURCHASE", purchase.getId())) {
                return;
            }
            items.add(WalletHistoryResponse.builder()
                    .id(purchase.getId())
                    .type(EWalletTransactionType.CREDIT_PURCHASE)
                    .typeLabel(WalletHistoryResponse.getTypeLabel(EWalletTransactionType.CREDIT_PURCHASE))
                    .amount(purchase.getTotalAmount() != null ? purchase.getTotalAmount().negate() : null)
                    .credits(purchase.getCreditsAmount())
                    .description(purchase.getDescription())
                    .referenceId(purchase.getId())
                    .referenceType("CREDIT_PURCHASE")
                    .createdAt(purchase.getPaidAt() != null ? purchase.getPaidAt() : purchase.getCreatedAt())
                    .build());
        });

        items.sort(Comparator.comparing(WalletHistoryResponse::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));

        int start = page * size;
        int end = Math.min(start + size, items.size());
        List<WalletHistoryResponse> pageContent = start >= items.size()
                ? List.of()
                : items.subList(start, end);

        Pageable pageable = PageRequest.of(page, size);
        Page<WalletHistoryResponse> result = new PageImpl<>(pageContent, pageable, items.size());
        return ApiResponse.success("Thành công", result);
    }

    private WalletHistoryResponse toResponse(WalletTransaction tx) {
        return WalletHistoryResponse.builder()
                .id(tx.getId())
                .type(tx.getType())
                .typeLabel(WalletHistoryResponse.getTypeLabel(tx.getType()))
                .amount(tx.getAmount())
                .credits(tx.getCredits())
                .description(tx.getDescription())
                .referenceId(tx.getReferenceId())
                .referenceType(tx.getReferenceType())
                .createdAt(tx.getCreatedAt())
                .build();
    }

    public ApiResponse<Page<WalletHistoryResponse>> getAdminTransactions(EWalletTransactionType type, int page, int size) {
        // Gom tất cả nguồn: WalletTransaction + BalanceDeposit (kể cả pending/cancel/expired)
        // để admin xem "lịch sử giao dịch" chung 1 nơi.
        // Lấy nhiều hơn `size` để đảm bảo khi trộn nhiều nguồn (WalletTransaction + BalanceDeposit + CreditPurchase)
        // thì trang đầu vẫn có đủ item theo thứ tự thời gian.
        int fetchLimit = Math.min(20000, (page + 1) * size * 20);
        Pageable fetchPageable = PageRequest.of(0, fetchLimit);

        List<WalletHistoryResponse> items = new ArrayList<>();

        // 1) WalletTransaction (đã log các event đã được ghi vào wallet)
        if (type != null) {
            walletTransactionRepository.findByTypeOrderByCreatedAtDesc(type, fetchPageable)
                    .forEach(tx -> items.add(WalletHistoryResponse.builder()
                            .id(tx.getId())
                            .type(tx.getType())
                            .typeLabel(WalletHistoryResponse.getTypeLabel(tx.getType()))
                            .amount(tx.getAmount())
                            .credits(tx.getCredits())
                            .description(tx.getDescription())
                            .referenceId(tx.getReferenceId())
                            .referenceType(tx.getReferenceType())
                            .userId(tx.getUser().getId())
                            .userName(tx.getUser().getFullName())
                            .createdAt(tx.getCreatedAt())
                            .build()));
        } else {
            walletTransactionRepository.findAllByOrderByCreatedAtDesc(fetchPageable)
                    .forEach(tx -> items.add(WalletHistoryResponse.builder()
                            .id(tx.getId())
                            .type(tx.getType())
                            .typeLabel(WalletHistoryResponse.getTypeLabel(tx.getType()))
                            .amount(tx.getAmount())
                            .credits(tx.getCredits())
                            .description(tx.getDescription())
                            .referenceId(tx.getReferenceId())
                            .referenceType(tx.getReferenceType())
                            .userId(tx.getUser().getId())
                            .userName(tx.getUser().getFullName())
                            .createdAt(tx.getCreatedAt())
                            .build()));
        }

        // 2) Nạp tiền (BalanceDeposit) - thường pending/cancel/expired sẽ chưa có WalletTransaction
        if (type == null || type == EWalletTransactionType.DEPOSIT) {
            balanceDepositRepository.findAllByOrderByCreatedAtDesc(fetchPageable).getContent().forEach(deposit -> {
                if (walletTransactionRepository.existsByReferenceTypeAndReferenceId("DEPOSIT", deposit.getId())) {
                    return; // đã có record trong WalletTransaction rồi
                }

                boolean isPending = deposit.isPending();
                boolean isPaid = deposit.isPaid();

                items.add(WalletHistoryResponse.builder()
                        .id(deposit.getId())
                        .type(EWalletTransactionType.DEPOSIT)
                        .typeLabel(
                                isPending
                                        ? "Nạp tiền (chờ thanh toán)"
                                        : WalletHistoryResponse.getTypeLabel(EWalletTransactionType.DEPOSIT)
                        )
                        .amount(deposit.getAmount())
                        .description(deposit.getDescription() != null ? deposit.getDescription() : "Nạp tiền vào ví")
                        .referenceId(deposit.getId())
                        .referenceType("DEPOSIT")
                        .status(deposit.getStatus().name())
                        .orderUrl(deposit.getOrderUrl())
                        .appTransId(deposit.getAppTransId())
                        .userId(deposit.getUser().getId())
                        .userName(deposit.getUser().getFullName())
                        .createdAt(isPaid && deposit.getPaidAt() != null ? deposit.getPaidAt() : deposit.getCreatedAt())
                        .build());
            });
        }

        // 3) CreditPurchase (chỗ này giữ giống getMyHistory cho trường hợp chưa được log vào WalletTransaction)
        if (type == null || type == EWalletTransactionType.CREDIT_PURCHASE) {
            creditPurchaseRepository.findAllByOrderByCreatedAtDesc(fetchPageable).getContent().forEach(purchase -> {
                if (!Boolean.TRUE.equals(purchase.getCreditsGranted())) return;
                if (walletTransactionRepository.existsByReferenceTypeAndReferenceId("CREDIT_PURCHASE", purchase.getId())) return;

                items.add(WalletHistoryResponse.builder()
                        .id(purchase.getId())
                        .type(EWalletTransactionType.CREDIT_PURCHASE)
                        .typeLabel(WalletHistoryResponse.getTypeLabel(EWalletTransactionType.CREDIT_PURCHASE))
                        .amount(purchase.getTotalAmount() != null ? purchase.getTotalAmount().negate() : null)
                        .credits(purchase.getCreditsAmount())
                        .description(purchase.getDescription())
                        .referenceId(purchase.getId())
                        .referenceType("CREDIT_PURCHASE")
                        .userId(purchase.getUser().getId())
                        .userName(purchase.getUser().getFullName())
                        .createdAt(purchase.getPaidAt() != null ? purchase.getPaidAt() : purchase.getCreatedAt())
                        .build());
            });
        }

        items.sort(Comparator.comparing(WalletHistoryResponse::getCreatedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));

        int start = page * size;
        int end = Math.min(start + size, items.size());
        List<WalletHistoryResponse> pageContent = start >= items.size()
                ? List.of()
                : items.subList(start, end);

        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.success("Thành công", new PageImpl<>(pageContent, pageable, items.size()));
    }

    public void logDepositPaid(BalanceDeposit deposit) {
        logBalance(
                deposit.getUser(),
                EWalletTransactionType.DEPOSIT,
                deposit.getAmount(),
                deposit.getDescription() != null ? deposit.getDescription() : "Nạp tiền vào ví",
                deposit.getId(),
                "DEPOSIT"
        );
    }
}
