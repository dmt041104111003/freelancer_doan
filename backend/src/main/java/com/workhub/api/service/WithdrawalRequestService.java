package com.workhub.api.service;

import com.workhub.api.dto.request.CreateWithdrawalRequest;
import com.workhub.api.dto.request.RespondWithdrawalRequest;
import com.workhub.api.dto.response.ApiResponse;
import com.workhub.api.dto.response.WithdrawalRequestResponse;
import com.workhub.api.entity.*;
import com.workhub.api.exception.UnauthorizedAccessException;
import com.workhub.api.repository.JobApplicationRepository;
import com.workhub.api.repository.JobRepository;
import com.workhub.api.repository.WithdrawalRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WithdrawalRequestService {

    private final WithdrawalRequestRepository withdrawalRequestRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final JobHistoryService jobHistoryService;
    private final WalletTransactionService walletTransactionService;

    private static final int EMPLOYER_PENALTY_PERCENT = 15;

    /**
     * Freelancer tạo yêu cầu rút khỏi job (không trừ phí trước)
     */
    @Transactional
    public ApiResponse<WithdrawalRequestResponse> createFreelancerWithdrawal(Long jobId, Long userId, CreateWithdrawalRequest req) {
        User user = userService.getById(userId);
        Job job = getJobById(jobId);

        if (job.getStatus() != EJobStatus.IN_PROGRESS) {
            throw new IllegalStateException("Chỉ có thể tạo yêu cầu rút khi công việc đang thực hiện");
        }

        boolean isAcceptedFreelancer = jobApplicationRepository
                .existsByJobIdAndFreelancerIdAndStatus(jobId, userId, EApplicationStatus.ACCEPTED);
        if (!isAcceptedFreelancer) {
            throw new UnauthorizedAccessException("Bạn không phải người làm của công việc này");
        }

        if (withdrawalRequestRepository.existsByJobIdAndStatus(jobId, EWithdrawalRequestStatus.PENDING)) {
            throw new IllegalStateException("Đã có yêu cầu hủy/rút đang chờ xử lý cho công việc này");
        }

        WithdrawalRequest request = WithdrawalRequest.builder()
                .job(job)
                .requester(user)
                .type(EWithdrawalRequestType.FREELANCER_WITHDRAW)
                .reason(req.getReason())
                .penaltyFee(BigDecimal.ZERO)
                .penaltyPercent(0)
                .build();

        WithdrawalRequest saved = withdrawalRequestRepository.save(request);

        jobHistoryService.logHistory(job, user, EJobHistoryAction.WITHDRAWAL_REQUESTED,
                "Yêu cầu rút khỏi công việc. Lý do: " + req.getReason());

        notificationService.notifyWithdrawalRequested(job.getEmployer(), job, user, true);

        return ApiResponse.success("Đã tạo yêu cầu rút. Chờ Employer xác nhận.",
                WithdrawalRequestResponse.fromEntity(saved));
    }

    /**
     * Employer tạo yêu cầu hủy job (không trừ phí trước)
     */
    @Transactional
    public ApiResponse<WithdrawalRequestResponse> createEmployerCancellation(Long jobId, Long userId, CreateWithdrawalRequest req) {
        User user = userService.getById(userId);
        Job job = getJobById(jobId);

        if (job.getStatus() != EJobStatus.IN_PROGRESS) {
            throw new IllegalStateException("Chỉ có thể tạo yêu cầu hủy khi công việc đang thực hiện");
        }

        if (!job.isOwnedBy(userId)) {
            throw new UnauthorizedAccessException("Bạn không phải người đăng công việc này");
        }

        if (withdrawalRequestRepository.existsByJobIdAndStatus(jobId, EWithdrawalRequestStatus.PENDING)) {
            throw new IllegalStateException("Đã có yêu cầu hủy/rút đang chờ xử lý cho công việc này");
        }

        WithdrawalRequest request = WithdrawalRequest.builder()
                .job(job)
                .requester(user)
                .type(EWithdrawalRequestType.EMPLOYER_CANCEL)
                .reason(req.getReason())
                .penaltyFee(BigDecimal.ZERO)
                .penaltyPercent(EMPLOYER_PENALTY_PERCENT)
                .build();

        WithdrawalRequest saved = withdrawalRequestRepository.save(request);

        jobHistoryService.logHistory(job, user, EJobHistoryAction.WITHDRAWAL_REQUESTED,
                "Yêu cầu hủy công việc. Lý do: " + req.getReason());

        User freelancer = getAcceptedFreelancer(jobId);
        if (freelancer != null) {
            notificationService.notifyWithdrawalRequested(freelancer, job, user, false);
        }

        return ApiResponse.success("Đã tạo yêu cầu hủy. Chờ Freelancer xác nhận.",
                WithdrawalRequestResponse.fromEntity(saved));
    }

    /**
     * Chấp nhận yêu cầu rút/hủy
     */
    @Transactional
    public ApiResponse<WithdrawalRequestResponse> approveRequest(Long requestId, Long userId, RespondWithdrawalRequest req) {
        User user = userService.getById(userId);
        WithdrawalRequest request = getRequestById(requestId);

        if (!request.isPending()) {
            throw new IllegalStateException("Yêu cầu này đã được xử lý");
        }

        Job job = request.getJob();
        if (request.isFreelancerRequest()) {
            // Freelancer tạo rút → Employer approve
            if (!job.isOwnedBy(userId)) {
                throw new UnauthorizedAccessException("Chỉ người đăng việc mới có quyền xác nhận");
            }
        } else {
            // Employer tạo hủy → Freelancer approve
            boolean isAcceptedFreelancer = jobApplicationRepository
                    .existsByJobIdAndFreelancerIdAndStatus(job.getId(), userId, EApplicationStatus.ACCEPTED);
            if (!isAcceptedFreelancer) {
                throw new UnauthorizedAccessException("Chỉ freelancer của công việc này mới có quyền xác nhận");
            }
        }

        request.approve(user, req != null ? req.getMessage() : null);
        withdrawalRequestRepository.save(request);

        if (request.isFreelancerRequest()) {
            // ===== FREELANCER RÚT: Employer đồng ý → Mở lại job =====
            JobApplication application = jobApplicationRepository
                    .findFirstByJobIdAndStatus(job.getId(), EApplicationStatus.ACCEPTED)
                    .orElseThrow(() -> new IllegalStateException("Không tìm thấy freelancer đang làm"));

            User freelancer = application.getFreelancer();
            User employer = job.getEmployer();

            application.setStatus(EApplicationStatus.REJECTED);
            application.clearWorkSubmission();
            jobApplicationRepository.save(application);

            job.reopenJob();
            jobRepository.save(job);

            freelancer.addUntrustScore(1);
            userService.save(freelancer);

            jobHistoryService.logHistory(job, user, EJobHistoryAction.WITHDRAWAL_APPROVED,
                    "Đã chấp nhận yêu cầu rút của " + freelancer.getFullName());
            jobHistoryService.logHistory(job, user, EJobHistoryAction.JOB_REOPENED,
                    "Công việc được mở lại để tuyển freelancer mới");

            notificationService.notifyWithdrawalApproved(freelancer, job, user);
            notificationService.notifyFreelancerClearedWithReason(employer, job, freelancer,
                    "Freelancer " + freelancer.getFullName() + " đã rút khỏi công việc \"" + job.getTitle() + "\". Công việc đã được mở lại để tuyển freelancer mới.");
            notificationService.notifyFreelancerWithdrawalPenalty(freelancer, job);

            return ApiResponse.success("Đã chấp nhận yêu cầu rút. Công việc đã được mở lại.",
                    WithdrawalRequestResponse.fromEntity(request));

        } else {
            // ===== EMPLOYER HỦY: Freelancer đồng ý → Trừ 15% escrow, hoàn 85% =====
            User employer = job.getEmployer();
            BigDecimal escrowAmount = job.getEscrowAmount();
            BigDecimal refundAmount = BigDecimal.ZERO;
            BigDecimal penaltyAmount = BigDecimal.ZERO;

            if (escrowAmount != null && escrowAmount.compareTo(BigDecimal.ZERO) > 0) {
                penaltyAmount = escrowAmount
                        .multiply(BigDecimal.valueOf(EMPLOYER_PENALTY_PERCENT))
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                refundAmount = escrowAmount.subtract(penaltyAmount);

                // Hoàn 85% cho employer
                employer.addBalance(refundAmount);
                userService.save(employer);

                walletTransactionService.logBalance(
                        employer,
                        EWalletTransactionType.ESCROW_REFUND,
                        refundAmount,
                        "Hoàn tiền escrow (hủy job, trừ " + EMPLOYER_PENALTY_PERCENT + "% phí): " + job.getTitle(),
                        job.getId(),
                        "JOB"
                );

                // Ghi nhận 15% phí phạt (platform giữ)
                walletTransactionService.logBalance(
                        employer,
                        EWalletTransactionType.PENALTY_FEE,
                        penaltyAmount,
                        "Phí hủy job " + EMPLOYER_PENALTY_PERCENT + "%: " + job.getTitle(),
                        job.getId(),
                        "JOB"
                );
            }

            job.close();
            jobRepository.save(job);

            jobHistoryService.logHistory(job, user, EJobHistoryAction.WITHDRAWAL_APPROVED,
                    "Đã chấp nhận yêu cầu hủy của " + employer.getFullName());
            jobHistoryService.logHistory(job, user, EJobHistoryAction.JOB_CANCELLED,
                    "Công việc đã bị hủy");

            notificationService.notifyWithdrawalApproved(request.getRequester(), job, user);

            String refundMsg = refundAmount.compareTo(BigDecimal.ZERO) > 0
                    ? "Số tiền " + refundAmount.toPlainString() + " VND đã được hoàn lại vào số dư của bạn."
                    : "";
            notificationService.notifyJobCancelledWithAmount(employer, job, refundMsg);

            return ApiResponse.success(
                    "Đã chấp nhận yêu cầu hủy. Trừ " + penaltyAmount.toPlainString() + " VND phí, hoàn " + refundAmount.toPlainString() + " VND.",
                    WithdrawalRequestResponse.fromEntity(request));
        }
    }

    /**
     * Từ chối yêu cầu rút/hủy (không hoàn gì vì chưa trừ phí trước)
     */
    @Transactional
    public ApiResponse<WithdrawalRequestResponse> rejectRequest(Long requestId, Long userId, RespondWithdrawalRequest req) {
        User user = userService.getById(userId);
        WithdrawalRequest request = getRequestById(requestId);

        if (!request.isPending()) {
            throw new IllegalStateException("Yêu cầu này đã được xử lý");
        }

        Job job = request.getJob();
        if (request.isFreelancerRequest()) {
            if (!job.isOwnedBy(userId)) {
                throw new UnauthorizedAccessException("Chỉ người đăng việc mới có quyền từ chối");
            }
        } else {
            boolean isAcceptedFreelancer = jobApplicationRepository
                    .existsByJobIdAndFreelancerIdAndStatus(job.getId(), userId, EApplicationStatus.ACCEPTED);
            if (!isAcceptedFreelancer) {
                throw new UnauthorizedAccessException("Chỉ freelancer của công việc này mới có quyền từ chối");
            }
        }

        request.reject(user, req != null ? req.getMessage() : null);
        withdrawalRequestRepository.save(request);

        jobHistoryService.logHistory(job, user, EJobHistoryAction.WITHDRAWAL_REJECTED,
                "Đã từ chối yêu cầu của " + request.getRequester().getFullName());

        notificationService.notifyWithdrawalRejected(request.getRequester(), job, user);

        return ApiResponse.success("Đã từ chối yêu cầu. Công việc tiếp tục.",
                WithdrawalRequestResponse.fromEntity(request));
    }

    /**
     * Người tạo hủy yêu cầu của mình (không hoàn phí vì chưa trừ)
     */
    @Transactional
    public ApiResponse<Void> cancelRequest(Long requestId, Long userId) {
        WithdrawalRequest request = getRequestById(requestId);

        if (!request.isPending()) {
            throw new IllegalStateException("Yêu cầu này đã được xử lý");
        }

        if (!request.getRequester().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Bạn không có quyền hủy yêu cầu này");
        }

        request.cancel();
        withdrawalRequestRepository.save(request);

        User user = userService.getById(userId);
        Job job = request.getJob();
        String description = request.isFreelancerRequest()
                ? "Đã hủy yêu cầu rút"
                : "Đã hủy yêu cầu hủy công việc";
        jobHistoryService.logHistory(job, user, EJobHistoryAction.WITHDRAWAL_CANCELLED, description);

        return ApiResponse.success("Đã hủy yêu cầu.", null);
    }

    /**
     * Lấy yêu cầu pending của job
     */
    public ApiResponse<WithdrawalRequestResponse> getPendingRequest(Long jobId, Long userId) {
        Job job = getJobById(jobId);

        boolean isEmployer = job.isOwnedBy(userId);
        boolean isAcceptedFreelancer = jobApplicationRepository
                .existsByJobIdAndFreelancerIdAndStatus(jobId, userId, EApplicationStatus.ACCEPTED);

        if (!isEmployer && !isAcceptedFreelancer) {
            throw new UnauthorizedAccessException("Bạn không có quyền xem thông tin này");
        }

        WithdrawalRequest request = withdrawalRequestRepository
                .findByJobIdAndStatus(jobId, EWithdrawalRequestStatus.PENDING)
                .orElse(null);

        if (request == null) {
            return ApiResponse.success("Không có yêu cầu nào", null);
        }

        return ApiResponse.success("Thành công", WithdrawalRequestResponse.fromEntity(request));
    }

    /**
     * Lấy lịch sử yêu cầu của job
     */
    public ApiResponse<List<WithdrawalRequestResponse>> getJobRequests(Long jobId, Long userId) {
        Job job = getJobById(jobId);

        boolean isEmployer = job.isOwnedBy(userId);
        boolean isAcceptedFreelancer = jobApplicationRepository
                .existsByJobIdAndFreelancerIdAndStatus(jobId, userId, EApplicationStatus.ACCEPTED);

        if (!isEmployer && !isAcceptedFreelancer) {
            throw new UnauthorizedAccessException("Bạn không có quyền xem thông tin này");
        }

        List<WithdrawalRequest> requests = withdrawalRequestRepository.findByJobIdOrderByCreatedAtDesc(jobId);
        List<WithdrawalRequestResponse> responses = requests.stream()
                .map(WithdrawalRequestResponse::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success("Thành công", responses);
    }

    private Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy công việc"));
    }

    private WithdrawalRequest getRequestById(Long requestId) {
        return withdrawalRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu"));
    }

    private User getAcceptedFreelancer(Long jobId) {
        return jobApplicationRepository.findFirstByJobIdAndStatus(jobId, EApplicationStatus.ACCEPTED)
                .map(JobApplication::getFreelancer)
                .orElse(null);
    }
}
