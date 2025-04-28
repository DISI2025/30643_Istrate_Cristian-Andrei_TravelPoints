package com.travel.dtos;
import com.travel.entity.AttractionEntity;
import com.travel.entity.UserEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;

@Data

public class VisitRequestDTO {
    @NotNull
    private AttractionEntity attraction;
    @NotNull
    private UserEntity user;
    @NotNull
    private Date visitTimestamp;
}
