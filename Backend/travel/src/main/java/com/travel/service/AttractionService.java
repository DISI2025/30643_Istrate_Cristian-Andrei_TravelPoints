package com.travel.service;

import com.travel.dtos.*;
import com.travel.entity.AttractionEntity;
import com.travel.entity.WishlistEntity;
import com.travel.mapper.AttractionMapper;
import com.travel.mapper.WishlistMapper;
import com.travel.repository.AttractionRepository;
import com.travel.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * attraction service class
 * calls all the methods needed already implemented
 * in the attraction interface
 */
@Service
public class AttractionService {
    private final AttractionRepository attractionRepository;
    private final WishlistRepository wishlistRepository;
    private final AttractionMapper attractionMapper;
    private final WishlistMapper wishlistMapper;

    @Autowired
    public AttractionService(AttractionRepository attractionRepository, AttractionMapper attractionMapper, WishlistRepository wishlistRepository, WishlistMapper wishlistMapper) {
        this.attractionRepository = attractionRepository;
        this.attractionMapper = attractionMapper;
        this.wishlistRepository = wishlistRepository;
        this.wishlistMapper = wishlistMapper;
    }

    public AttractionResponseDTO getAttractionById(Long id) {
        Optional<AttractionEntity> result = attractionRepository.findAttractionById(id);

        return attractionMapper.toDTO(result.get());
    }

    public List<AttractionResponseDTO> getAllAttractions() {
        return attractionRepository.findAll().stream().map(attraction -> attractionMapper.toDTO(attraction)).toList();
    }


    public List<AttractionResponseDTO> filterAttractionsByLocation(String location) {
        List<AttractionEntity> filteredAttractions = attractionRepository.findByLocation(location);

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }


    public List<AttractionResponseDTO> filterAttractionsByCategory(String category) {
        List<AttractionEntity> filteredAttractions = attractionRepository.findByCategory(category);

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }


    public List<AttractionResponseDTO> filterAttractionsByPriceRange(Double minPrice, Double maxPrice) {
        if (minPrice > maxPrice) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price.");
        }

        List<AttractionEntity> filteredAttractions = attractionRepository.findByPriceBetween(minPrice, maxPrice);

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }

    public List<AttractionResponseDTO> filterAttractionsByName(String name) {
        List<AttractionEntity> filteredAttractions = attractionRepository.findByNameContainingIgnoreCase(name);

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }

    public AttractionPageResponseDTO getAllAttractionsPageable(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<AttractionEntity> page = attractionRepository.findAll(pageable);

        AttractionPageResponseDTO response = new AttractionPageResponseDTO();
        response.setContent(attractionMapper.listToDTO(page.getContent()));
        response.setNumberOfElements(page.getNumberOfElements());
        return response;
    }


    public AttractionResponseDTO addAttraction(AttractionRequestDTO attraction) {
        return attractionMapper.toDTO(attractionRepository.save(attractionMapper.toEntity(attraction)));
    }

    public AttractionResponseDTO updateAttraction(Long id, AttractionRequestDTO attractionRequestDTO) {
        Optional<AttractionEntity> originalEntity = attractionRepository.findAttractionById(id);
        AttractionEntity attractionEntity = attractionMapper.toEntity(attractionRequestDTO);
        attractionEntity.setId(id);
        attractionEntity.setOldPrice(originalEntity.get().getPrice());

        if(attractionEntity.getPrice() < attractionEntity.getOldPrice()) {
            notifyInterestedUsers(attractionEntity);
        }
        return attractionMapper.toDTO(attractionRepository.save(attractionEntity));
    }

    public void deleteAttraction(Long id) {
        this.getAttractionById(id);
        attractionRepository.deleteById(id);
    }

    public List<NotificationResponseDTO> notifyInterestedUsers(AttractionEntity attraction){
        List<WishlistEntity> wishlists = wishlistRepository.findByAttractionId(attraction.getId());

        List<NotificationResponseDTO> messages = new ArrayList<>();

        for (WishlistEntity wishlist : wishlists) {
            WishlistResponseDTO aux = wishlistMapper.toDTO(wishlist);
            NotificationResponseDTO msg = new NotificationResponseDTO(aux.getUser(),aux.getAttraction(),aux.getAttraction().getOffers());
            messages.add(msg);
        }

        return messages;
    }
}
