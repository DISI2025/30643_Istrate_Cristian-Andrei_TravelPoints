package com.travel.controller;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.ItemNotFoundException;
import com.travel.mapper.AttractionMapper;
import com.travel.service.AttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


// port 8081 is assigned FOR NOW to be the port for the frontend server
// @CrossOrigin(origins = "http://localhost:<frontend-port>")
@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/attraction")
public class AttractionController {
    private final AttractionService attractionService;
    private final AttractionMapper attractionMapper;

    @Autowired
    public AttractionController(AttractionService attractionService, AttractionMapper attractionMapper) {
        this.attractionService = attractionService;
        this.attractionMapper = attractionMapper;
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttractionResponseDTO>> getAllAdmins() {
        List<AttractionResponseDTO> attractions = attractionService.getAllAttractions().stream().map(attractionEntity -> attractionMapper.toDTO(attractionEntity)).toList();
        return new ResponseEntity<>(attractions, HttpStatus.OK);
    }

    @GetMapping("find/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable("id") Long id) {
        try {
            Optional<AttractionEntity> attractionEntity = attractionService.getAttractionById(id);
            System.out.println(attractionEntity.get());
            return new ResponseEntity<>(attractionMapper.toDTO(attractionEntity.get()), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAdmin(@RequestBody AttractionRequestDTO attractionRequestDTO) {
        try {
            AttractionEntity entity = attractionMapper.toEntity(attractionRequestDTO);
            System.out.println("Mapped entity: " + entity);
            AttractionEntity saved = attractionService.updateOrAddAttraction(entity);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Missing required field: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAttraction(@PathVariable("id") Long id, @RequestBody AttractionRequestDTO attractionRequestDTO) {
        try {
            Optional<AttractionEntity> existing = attractionService.getAttractionById(id);
            if (existing.isEmpty()) {
                return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
            }
            AttractionEntity updated = attractionMapper.toEntity(attractionRequestDTO);
            updated.setId(id);
            updated = attractionService.updateOrAddAttraction(updated);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAttraction(@PathVariable("id") Long id) {
        try {
            Optional<AttractionEntity> existing = attractionService.getAttractionById(id);
            if (existing.isEmpty()) {
                return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
            }
            attractionService.deleteAttraction(id);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
