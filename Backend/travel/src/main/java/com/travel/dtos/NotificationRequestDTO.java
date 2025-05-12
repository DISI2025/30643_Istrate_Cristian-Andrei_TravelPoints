package com.travel.dtos;

import lombok.Data;

@Data
public class NotificationRequestDTO {
    private Long userId;
    private Long attractionId;
    private String message;
}
