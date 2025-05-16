package com.travel.dtos;
import com.travel.entity.AttractionEntity;
import com.travel.entity.UserEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;
import java.time.LocalDateTime;

@Data

public class VisitRequestDTO {
    @NotNull
    private Long attractionId;
    @NotNull
    private Long userId;
    @NotNull
    private LocalDateTime visitTimestamp;
}
