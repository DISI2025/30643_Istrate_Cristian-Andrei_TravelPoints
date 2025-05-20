package com.travel.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContactMessageResponseDTO {

    private Long id;
    private UserResponseDTO user;
    private String subject;
    private String message;
    private LocalDateTime sent_at;
}
