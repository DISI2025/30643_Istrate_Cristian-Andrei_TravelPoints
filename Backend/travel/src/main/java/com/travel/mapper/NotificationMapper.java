package com.travel.mapper;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.dtos.NotificationRequestDTO;
import com.travel.dtos.NotificationResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.NotificationEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, AttractionMapper.class})
public interface NotificationMapper {
    NotificationResponseDTO toDTO (NotificationEntity notificationEntity);
    NotificationEntity toEntity (NotificationRequestDTO notificationRequestDTO);
}
