package com.travel.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @NotNull(message = "Comment is required")
    private String comment;

    @NotNull(message = "CreatedAt is required")
    private Date createdAt;
}
