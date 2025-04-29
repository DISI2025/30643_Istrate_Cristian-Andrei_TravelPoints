package com.travel.dtos;

import lombok.*;
import java.util.Date;

@Data
public class WishlistRequestDTO {
    @NonNull
    private Long attractionId;
    @NonNull
    private Date addedAt;
}
