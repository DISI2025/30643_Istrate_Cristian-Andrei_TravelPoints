package com.travel.mapper;

import com.travel.dtos.ContactMessageRequestDTO;
import com.travel.dtos.ContactMessageResponseDTO;
import com.travel.entity.ContactMessageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ContactMessageMapper {

    @Mapping(target = "sentAt", expression = "java(java.time.LocalDateTime.now())")
    ContactMessageEntity toEntity(ContactMessageRequestDTO dto);

    ContactMessageResponseDTO toDTO(ContactMessageEntity entity);
}
