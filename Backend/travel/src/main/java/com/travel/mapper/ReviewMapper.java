package com.travel.mapper;

import com.travel.dtos.ReviewRequestDTO;
import com.travel.dtos.ReviewResponseDTO;
import com.travel.entity.ReviewEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, AttractionMapper.class})
public interface ReviewMapper {

    ReviewResponseDTO toDTO (ReviewEntity reviewEntity);
    ReviewEntity toEntity (ReviewRequestDTO reviewRequestDTO);
}
