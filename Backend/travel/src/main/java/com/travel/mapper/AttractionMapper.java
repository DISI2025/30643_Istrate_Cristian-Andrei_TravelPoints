package com.travel.mapper;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttractionMapper {
    AttractionResponseDTO toDTO (AttractionEntity attractionEntity);
    AttractionEntity toEntity (AttractionRequestDTO attractionRequestDTO);

    List<AttractionResponseDTO> listToDTO (List<AttractionEntity> attractions);

    void updateEntityFromDTO(AttractionRequestDTO dto, @MappingTarget AttractionEntity entity);
}
