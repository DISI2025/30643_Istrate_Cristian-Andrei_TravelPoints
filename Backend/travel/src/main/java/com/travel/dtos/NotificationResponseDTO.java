package com.travel.dtos;

import lombok.Data;

@Data
public class NotificationResponseDTO {
    private UserResponseDTO user;
    private AttractionResponseDTO attraction;
    private String message;

    public NotificationResponseDTO(UserResponseDTO user, AttractionResponseDTO attraction, String offers) {
        this.user = user;
        this.attraction = attraction;
        this.message = offers;
    }
}
