package com.travel.mapper;

import com.travel.dtos.UserRequestDTO;
import com.travel.dtos.UserResponseDTO;
import com.travel.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO toDTO (UserEntity attractionEntity);
    UserEntity toEntity (UserRequestDTO attractionRequestDTO);
}
