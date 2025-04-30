package com.travel.mapper;

import com.travel.dtos.WishlistRequestDTO;
import com.travel.dtos.WishlistResponseDTO;
import com.travel.entity.WishlistEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, AttractionMapper.class})
public interface WishlistMapper {

    WishlistResponseDTO toDTO (WishlistEntity wishlistEntity);
    WishlistEntity toEntity (WishlistRequestDTO wishlistRequestDTO);
}
