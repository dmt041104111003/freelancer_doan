package com.workhub.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceStatisticsResponse {

    // Nạp tiền
    private BigDecimal totalDeposited;
    private Long totalTransactions;
    private Long paidTransactions;
    private Long pendingTransactions;
    private Long cancelledTransactions;
    private Long expiredTransactions;
    private BigDecimal todayDeposited;
    private Long todayTransactions;
    private BigDecimal monthDeposited;
    private Long monthTransactions;

    // Doanh thu & lợi nhuận (phí 5% escrow)
    private BigDecimal totalRevenue;
    private BigDecimal totalFreelancerPaid;
    private BigDecimal totalEscrowHeld;
    private BigDecimal totalEscrowRefunded;

    // Nền tảng
    private Long totalUsers;
    private Long totalEmployers;
    private Long totalFreelancers;
    private Long totalJobs;
    private Long openJobs;
    private Long inProgressJobs;
    private Long completedJobs;
    private Long disputedJobs;
    private Long cancelledJobs;
    private Long totalApplications;
}
