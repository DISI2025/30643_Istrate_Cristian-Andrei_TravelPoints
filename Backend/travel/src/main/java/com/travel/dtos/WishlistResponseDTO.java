package com.travel.dtos;

import com.travel.entity.AttractionEntity;
import lombok.*;

import java.util.Date;

@Data
public class WishlistResponseDTO {

    private Long Id;
    private UserResponseDTO user;
    private AttractionResponseDTO attraction;
    private Date addedAt;

}
