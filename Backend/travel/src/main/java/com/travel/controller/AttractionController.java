package com.travel.controller;

import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.ItemNotFoundException;
import com.travel.mapper.AttractionMapper;
import com.travel.service.AttractionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    @Autowired
    public AttractionController(AttractionService attractionService) {
        this.attractionService = attractionService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttractionResponseDTO>> getAllAttractions() {
        List<AttractionResponseDTO> attractions = attractionService.getAllAttractions();
        return new ResponseEntity<>(attractions, HttpStatus.OK);
    }

    @GetMapping("find/{id}")
    public ResponseEntity<?> getAttractionById(@PathVariable("id") Long id) {
        try {
            AttractionResponseDTO existing = attractionService.getAttractionById(id);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filterByLocation")
    public ResponseEntity<?> filterAttractionsByLocation(
            @RequestParam(required = false) String location
    ) {
        try {
            List<AttractionResponseDTO> attractions = attractionService.filterAttractionsByLocation(location);
            return new ResponseEntity<>(attractions, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No attractions found for the given location.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/filterByCategory")
    public ResponseEntity<?> filterAttractionsByCategory(
            @RequestParam String category
    ) {
        try {
            List<AttractionResponseDTO> attractions = attractionService.filterAttractionsByCategory(category);
            return new ResponseEntity<>(attractions, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No attractions found for the given category: " + category, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filterByPrice")
    public ResponseEntity<?> filterAttractionsByPrice(
            @RequestParam(required = false) Double price
    ) {
        try {
            List<AttractionResponseDTO> attractions = attractionService.filterAttractionsByPrice(price);
            return new ResponseEntity<>(attractions, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("No attractions found for the given price.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    @PostMapping("/add")
    public ResponseEntity<?> addAttraction(@Valid @RequestBody AttractionRequestDTO attractionRequestDTO) {
        try {
            AttractionResponseDTO saved = attractionService.addAttraction(attractionRequestDTO);
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
            AttractionResponseDTO existing = attractionService.getAttractionById(id);
            existing = attractionService.updateAttraction(id, attractionRequestDTO);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage() + " " + e.getClass().getName(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAttraction(@PathVariable("id") Long id) {
        try {
            attractionService.deleteAttraction(id);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
