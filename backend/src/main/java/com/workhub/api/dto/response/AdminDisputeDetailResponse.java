package com.workhub.api.dto.response;

import com.workhub.api.entity.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
public class AdminDisputeDetailResponse {
    private Long id;
    private EDisputeStatus status;
    private String statusLabel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private JobInfo job;
    private PartyDetail employer;
    private PartyDetail freelancer;
    private String employerDescription;
    private FileAttachment employerEvidenceFile;
    private String freelancerDescription;
    private FileAttachment freelancerEvidenceFile;
    private LocalDateTime freelancerDeadline;
    private String adminNote;
    private AdminInfo resolvedBy;
    private LocalDateTime resolvedAt;

    @Data
    @Builder
    public static class JobInfo {
        private Long id;
        private String title;
        private String description;
        private String context;
        private String requirements;
        private String deliverables;
        private Set<String> skills;
        private String complexity;
        private String duration;
        private String workType;
        private BigDecimal budget;
        private BigDecimal escrowAmount;
        private String currency;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class PartyDetail {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String avatarUrl;
        private String title;
        private String location;
        private String company;
        private String bio;
        private Boolean isVerified;
        private Integer trustScore;
        private Integer untrustScore;
        private Set<String> skills;
        private LocalDateTime createdAt;

        private JobApplicationInfo jobApplication;
        private List<JobHistoryInfo> history;
        private List<FileUploadInfo> uploadedFiles;

        public static PartyDetail fromUser(User user) {
            return PartyDetail.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phoneNumber(user.getPhoneNumber())
                    .avatarUrl(user.getAvatarUrl())
                    .title(user.getTitle())
                    .location(user.getLocation())
                    .company(user.getCompany())
                    .bio(user.getBio())
                    .isVerified(user.getIsVerified())
                    .trustScore(user.getTrustScore())
                    .untrustScore(user.getUntrustScore())
                    .skills(user.getSkills())
                    .createdAt(user.getCreatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    public static class JobApplicationInfo {
        private Long id;
        private String coverLetter;
        private String status;
        private String workStatus;
        private String workSubmissionUrl;
        private String workSubmissionNote;
        private LocalDateTime workSubmittedAt;
        private String workRevisionNote;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private FileAttachment workSubmissionFile;
    }

    @Data
    @Builder
    public static class JobHistoryInfo {
        private Long id;
        private String action;
        private String actionLabel;
        private String description;
        private LocalDateTime createdAt;
        private UserBrief user;

        public static JobHistoryInfo fromEntity(JobHistory h) {
            return JobHistoryInfo.builder()
                    .id(h.getId())
                    .action(h.getAction().name())
                    .actionLabel(getActionLabel(h.getAction()))
                    .description(h.getDescription())
                    .createdAt(h.getCreatedAt())
                    .user(UserBrief.builder()
                            .id(h.getUser().getId())
                            .fullName(h.getUser().getFullName())
                            .avatarUrl(h.getUser().getAvatarUrl())
                            .build())
                    .build();
        }

        private static String getActionLabel(EJobHistoryAction action) {
            return switch (action) {
                case JOB_CREATED -> "Tạo công việc";
                case JOB_UPDATED -> "Cập nhật";
                case JOB_SUBMITTED -> "Gửi duyệt";
                case JOB_OPENED -> "Mở tuyển";
                case JOB_CLOSED -> "Đóng tuyển";
                case APPLICATION_ACCEPTED -> "Duyệt ứng viên";
                case APPLICATION_REJECTED -> "Từ chối ứng viên";
                case WORK_APPROVED -> "Duyệt công việc";
                case WORK_REJECTED -> "Yêu cầu chỉnh sửa";
                case PAYMENT_RELEASED -> "Thanh toán";
                case APPLICATION_SUBMITTED -> "Nộp đơn";
                case APPLICATION_WITHDRAWN -> "Rút đơn";
                case WORK_STARTED -> "Bắt đầu làm";
                case WORK_SUBMITTED -> "Nộp sản phẩm";
                case WORK_REVISED -> "Nộp lại";
                case JOB_APPROVED -> "Admin duyệt";
                case JOB_REJECTED -> "Admin từ chối";
                case JOB_COMPLETED -> "Hoàn thành";
                case JOB_CANCELLED -> "Đã hủy";
                case WITHDRAWAL_REQUESTED -> "Yêu cầu rút/hủy";
                case WITHDRAWAL_APPROVED -> "Chấp nhận yêu cầu";
                case WITHDRAWAL_REJECTED -> "Từ chối yêu cầu";
                case WITHDRAWAL_CANCELLED -> "Hủy yêu cầu";
                case FREELANCER_TIMEOUT -> "Freelancer quá hạn";
                case EMPLOYER_TIMEOUT -> "Employer quá hạn";
                case JOB_REOPENED -> "Mở lại công việc";
                case AUTO_APPROVED -> "Tự động duyệt";
                case DISPUTE_CREATED -> "Tạo khiếu nại";
                case DISPUTE_RESPONSE_SUBMITTED -> "Phản hồi khiếu nại";
                case DISPUTE_RESOLVED -> "Đã xử lý tranh chấp";
            };
        }
    }

    @Data
    @Builder
    public static class UserBrief {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }

    @Data
    @Builder
    public static class AdminInfo {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }

    @Data
    @Builder
    public static class FileUploadInfo {
        private Long id;
        private String secureUrl;
        private String originalFilename;
        private String readableSize;
        private String mimeType;
        private String usage;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class FileAttachment {
        private Long id;
        private String secureUrl;
        private String originalFilename;
        private String readableSize;
    }

    private static String getStatusLabel(EDisputeStatus status) {
        return switch (status) {
            case PENDING_FREELANCER_RESPONSE -> "Chờ freelancer phản hồi";
            case PENDING_ADMIN_DECISION -> "Chờ admin quyết định";
            case EMPLOYER_WON -> "Employer thắng";
            case FREELANCER_WON -> "Freelancer thắng";
            case CANCELLED -> "Đã hủy";
        };
    }
}
