package com.travel.mapper;

import com.travel.dtos.UserRequestDTO;
import com.travel.dtos.UserResponseDTO;
import com.travel.dtos.VisitRequestDTO;
import com.travel.dtos.VisitResponseDTO;
import com.travel.entity.UserEntity;
import com.travel.entity.VisitEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring", uses = {UserMapper.class, AttractionMapper.class})
public interface VisitMapper {
    @Mapping(source = "user", target = "userResponseDTO")
    @Mapping(source = "attraction", target = "attractionResponseDTO")
    VisitResponseDTO toDTO (VisitEntity visitEntity);
    VisitEntity toEntity (VisitRequestDTO visitRequestDTO);
}
