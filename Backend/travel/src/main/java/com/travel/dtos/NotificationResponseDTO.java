package com.travel.dtos;

import lombok.Data;

@Data
public class NotificationResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private AttractionResponseDTO attraction;
    private String message;

    public NotificationResponseDTO(UserResponseDTO user, AttractionResponseDTO attraction, String offers) {
    }
}
