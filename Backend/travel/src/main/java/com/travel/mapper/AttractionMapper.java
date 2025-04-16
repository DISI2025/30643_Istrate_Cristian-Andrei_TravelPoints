package com.travel.mapper;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AttractionMapper {
    AttractionResponseDTO toDTO (AttractionEntity attractionEntity);
    AttractionEntity toEntity (AttractionRequestDTO attractionRequestDTO);
}
