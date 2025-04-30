package com.travel.dtos;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@Data
public class WishlistRequestDTO {
    @NotNull(message = "User ID is required")
    private Long userId;
    @NotNull(message = "Attraction ID is required")
    private Long attractionId;
    @NotNull(message = "Date added is required")
    private Date addedAt;
}
