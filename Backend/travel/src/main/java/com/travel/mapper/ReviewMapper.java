package com.travel.mapper;

import com.travel.dtos.ReviewRequestDTO;
import com.travel.dtos.ReviewResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.ReviewEntity;
import com.travel.entity.UserEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UserMapper.class, AttractionMapper.class})
public interface ReviewMapper {

    ReviewResponseDTO toDTO (ReviewEntity reviewEntity);
    ReviewEntity toEntity (ReviewRequestDTO reviewRequestDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "user")
    @Mapping(target = "attraction", source = "attraction")
    @Mapping(target = "createdAt", expression = "java(new java.sql.Date(System.currentTimeMillis()))")
    void updateFromDTO(ReviewRequestDTO dto,
                       @MappingTarget ReviewEntity entity,
                       UserEntity user,
                       AttractionEntity attraction);
}
