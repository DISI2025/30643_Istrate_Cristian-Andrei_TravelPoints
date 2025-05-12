package com.travel.dtos;
import com.travel.entity.AttractionEntity;
import com.travel.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;

@Data

public class VisitResponseDTO {
    private Long id;
    private AttractionResponseDTO attraction;
    private UserResponseDTO user;
    private Date addedAt;
}
