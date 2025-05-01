package com.travel.controller;

import com.travel.dtos.AttractionPageResponseDTO;
import com.travel.dtos.AttractionRequestDTO;
import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.exceptions.ItemNotFoundException;
import com.travel.mapper.AttractionMapper;
import com.travel.service.AttractionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
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
@Validated
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
            @RequestParam @NotBlank(message = "Location must not be blank") String location
    ) {
        try {
            List<AttractionResponseDTO> attractions = attractionService.filterAttractionsByLocation(location);
            return new ResponseEntity<>(attractions, HttpStatus.OK);
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
        }catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/filterByPriceRange")
    public ResponseEntity<?> filterAttractionsByPriceRange(
            @RequestParam @NotNull(message = "Minimum price must not be null") @Positive(message = "Minimum price must be positive") Double minPrice,
            @RequestParam @NotNull(message = "Maximum price must not be null") @Positive(message = "Maximum price must be positive") Double maxPrice
    ) {
        try {
            List<AttractionResponseDTO> attractions = attractionService.filterAttractionsByPriceRange(minPrice, maxPrice);
            return new ResponseEntity<>(attractions, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid price range: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filterByName")
    public ResponseEntity<?> filterAttractionsByName(
            @RequestParam @NotBlank(message = "Attraction name must not be blank") String name
    ) {
        try {
            List<AttractionResponseDTO> attractions = attractionService.filterAttractionsByName(name);
            return new ResponseEntity<>(attractions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllPageable")
    public ResponseEntity<?> getAllAttractionsPageable(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        try {
            AttractionPageResponseDTO page = attractionService.getAllAttractionsPageable(pageNumber, pageSize);
            return new ResponseEntity<>(page, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/add")
    @Secured("ROLE_ADMIN")
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
    @Secured("ROLE_ADMIN")
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
    @Secured("ROLE_ADMIN")
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
