package com.travel.dtos;

import java.sql.Date;
import lombok.Data;

@Data
public class ReviewResponseDTO {

    private Long id;
    private AttractionResponseDTO attraction;
    private UserResponseDTO user;
    private Integer rating;
    private String comment;
    private Date createdAt;
}
