package com.travel.service;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.mapper.AttractionMapper;
import com.travel.repository.AttractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
    private final AttractionMapper attractionMapper;

    @Autowired
    public AttractionService(AttractionRepository attractionRepository, AttractionMapper attractionMapper) {
        this.attractionRepository = attractionRepository;
        this.attractionMapper = attractionMapper;
    }

    public AttractionResponseDTO getAttractionById(Long id) {
        Optional<AttractionEntity> result = attractionRepository.findAttractionById(id);
        if(result.isEmpty()){
            throw new NoSuchElementException("The attraction with the id: " + id + " does not exist");
        }
        return attractionMapper.toDTO(result.get());
    }

    public List<AttractionResponseDTO> getAllAttractions() {
        return attractionRepository.findAll().stream().map(attraction -> attractionMapper.toDTO(attraction)).toList();
    }


    public List<AttractionResponseDTO> filterAttractionsByLocation(String location) {
        List<AttractionEntity> filteredAttractions = attractionRepository.findByLocation(location);

        if (filteredAttractions.isEmpty()) {
            throw new NoSuchElementException("No attractions found for the given location.");
        }

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }


    public List<AttractionResponseDTO> filterAttractionsByCategory(String category) {
        List<AttractionEntity> filteredAttractions = attractionRepository.findByCategory(category);

        if (filteredAttractions.isEmpty()) {
            throw new NoSuchElementException("No attractions found for the given category: " + category);
        }

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }


    public List<AttractionResponseDTO> filterAttractionsByPriceRange(Double minPrice, Double maxPrice) {
        if (minPrice > maxPrice) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price.");
        }

        List<AttractionEntity> filteredAttractions = attractionRepository.findByPriceBetween(minPrice, maxPrice);

        if (filteredAttractions.isEmpty()) {
            throw new NoSuchElementException("No attractions found in the given price range.");
        }

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }

    public List<AttractionResponseDTO> filterAttractionsByName(String name) {
        List<AttractionEntity> filteredAttractions = attractionRepository.findByNameContainingIgnoreCase(name);

        if (filteredAttractions.isEmpty()) {
            throw new NoSuchElementException("No attractions found with the name: " + name);
        }

        return filteredAttractions.stream()
                .map(attractionMapper::toDTO)
                .toList();
    }

    public Page<AttractionResponseDTO> getAllAttractionsPageable(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<AttractionEntity> page = attractionRepository.findAll(pageable);
        return page.map(attractionMapper::toDTO);
    }



    public AttractionResponseDTO addAttraction(AttractionRequestDTO attraction) {
        return attractionMapper.toDTO(attractionRepository.save(attractionMapper.toEntity(attraction)));
    }

    public AttractionResponseDTO updateAttraction(Long id, AttractionRequestDTO attractionRequestDTO) {
        AttractionEntity attractionEntity = attractionMapper.toEntity(attractionRequestDTO);
        attractionEntity.setId(id);
        return attractionMapper.toDTO(attractionRepository.save(attractionEntity));
    }

    public void deleteAttraction(Long id) {
        this.getAttractionById(id);
        attractionRepository.deleteById(id);
    }
}
