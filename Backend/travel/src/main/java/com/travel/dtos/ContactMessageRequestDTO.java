package com.travel.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactMessageRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Subject is required")
    private String subject;

    @NotNull(message = "Message is required")
    private String message;

}
