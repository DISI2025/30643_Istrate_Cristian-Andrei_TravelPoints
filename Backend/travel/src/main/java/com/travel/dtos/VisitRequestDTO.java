package com.travel.dtos;
import com.travel.entity.AttractionEntity;
import com.travel.entity.UserEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;

@Data

public class VisitRequestDTO {
    @NotNull
    private Long attractionId;
    @NotNull
    private Long userId;
    @NotNull
    private Date visitTimestamp;
}
