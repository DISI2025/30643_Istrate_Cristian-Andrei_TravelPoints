package com.travel.dtos;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@Data
public class ReviewRequestDTO {


    @NotNull(message = "Attraction ID is required")
    private Long attractionId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Rating is required")
    private Integer rating;

    @NotNull(message = "Comment is required")
    private String comment;

    @NotNull(message = "CreatedAt is required")
    private Date createdAt;
}
