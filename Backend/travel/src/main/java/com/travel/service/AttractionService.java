package com.travel.service;


import com.travel.dtos.*;
import com.travel.entity.AttractionEntity;
import com.travel.entity.WishlistEntity;
import com.travel.mapper.AttractionMapper;
import com.travel.mapper.WishlistMapper;
import com.travel.repository.AttractionRepository;
import com.travel.repository.WishlistRepository;
import com.travel.utils.AttractionSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.lang.reflect.Array;
import java.util.*;

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
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AttractionService(AttractionRepository attractionRepository, AttractionMapper attractionMapper, WishlistRepository wishlistRepository, WishlistMapper wishlistMapper, SimpMessagingTemplate simpMessagingTemplate) {
        this.attractionRepository = attractionRepository;
        this.attractionMapper = attractionMapper;
        this.wishlistRepository = wishlistRepository;
        this.wishlistMapper = wishlistMapper;
        this.messagingTemplate = simpMessagingTemplate;
    }

    public AttractionResponseDTO getAttractionById(Long id) {
        Optional<AttractionEntity> result = attractionRepository.findAttractionById(id);

        return attractionMapper.toDTO(result.get());
    }

    public List<AttractionResponseDTO> getAllAttractions() {
        return attractionRepository.findAll().stream().map(attraction -> attractionMapper.toDTO(attraction)).toList();
    }

    public AttractionPageResponseDTOPagination getFilteredAttractions(String name, String location, String category, Double minPrice, Double maxPrice, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<AttractionEntity> page = attractionRepository.findAll(
                AttractionSpecification.filterBy(name, location, category, minPrice, maxPrice),
                pageable
        );

        return new AttractionPageResponseDTOPagination(
                page.getContent()
                        .stream()
                        .map(attractionMapper::toDTO)
                        .toList(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.getNumber()
        );
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

    public AttractionResponseDTO updateAttraction(Long id, AttractionRequestDTO dto) {
        AttractionEntity existing = attractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attraction not found"));

        double oldPrice = existing.getPrice();
        attractionMapper.updateEntityFromDTO(dto, existing);
        existing.setOldPrice(oldPrice);


        if (existing.getPrice() < existing.getOldPrice() ||
                !Objects.equals(existing.getOffers(), dto.getOffers())) {
            notifyInterestedUsers(existing);
        }

        return attractionMapper.toDTO(attractionRepository.save(existing));
    }

    public void deleteAttraction(Long id) {
        this.getAttractionById(id);
        attractionRepository.deleteById(id);
    }

    public List<NotificationResponseDTO> notifyInterestedUsers(AttractionEntity attraction) {
        List<WishlistEntity> wishlists = wishlistRepository.findByAttractionId(attraction.getId());

        List<NotificationResponseDTO> messages = new ArrayList<>();

        for (WishlistEntity wishlist : wishlists) {
            WishlistResponseDTO aux = wishlistMapper.toDTO(wishlist);
            NotificationResponseDTO msg = new NotificationResponseDTO(aux.getUser(),aux.getAttraction(),"The attraction you have added to wishlist got new offers");
            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + aux.getUser().getId(),
                    msg
            );
            messages.add(msg);
        }

        return messages;
    }
}
