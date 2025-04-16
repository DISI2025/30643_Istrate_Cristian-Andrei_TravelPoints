package com.travel.service;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.ItemNotFoundException;
import com.travel.mapper.AttractionMapper;
import com.travel.repository.AttractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

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
