package com.ssafy.domain.companion.dto.response;

import com.ssafy.common.Status;
import com.ssafy.domain.companion.entity.CompanionUser;
import jakarta.validation.constraints.NotNull;

public record CompanionUserResponse(
        @NotNull Long companionId,
        @NotNull String memberId,
        @NotNull String memberNickname,
        @NotNull Status companionStatus) {
    public static CompanionUserResponse from(CompanionUser companionUser) {
        return new CompanionUserResponse(
                companionUser.getCompanion().getId(),
                companionUser.getMember().getId(),
                companionUser.getMember().getNickname(),
                companionUser.getStatus()
                );
    }
}


