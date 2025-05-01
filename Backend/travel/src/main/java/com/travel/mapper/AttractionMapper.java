package com.travel.mapper;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttractionMapper {
    AttractionResponseDTO toDTO (AttractionEntity attractionEntity);
    AttractionEntity toEntity (AttractionRequestDTO attractionRequestDTO);

    List<AttractionResponseDTO> listToDTO (List<AttractionEntity> attractions);
}
