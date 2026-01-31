package com.workhub.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerListItemResponse {
    private AuthResponse.UserResponse user;
    private String relationStatus;
    private Long conversationId;
}
