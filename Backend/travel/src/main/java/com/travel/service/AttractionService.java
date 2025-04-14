package com.travel.service;

import com.travel.entity.AttractionEntity;
import com.travel.entity.ItemNotFoundException;
import com.travel.repository.AttractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    @Autowired
    public AttractionService(AttractionRepository attractionRepository) {
        this.attractionRepository = attractionRepository;
    }

    public Optional<AttractionEntity> getAttractionById(Long id) {
        return attractionRepository.findAttractionById(id);
    }

    public List<AttractionEntity> getAllAttractions() {
        return attractionRepository.findAll();
    }

    public AttractionEntity updateOrAddAttraction(AttractionEntity attractionEntity) {
        return attractionRepository.save(attractionEntity);
    }
}
