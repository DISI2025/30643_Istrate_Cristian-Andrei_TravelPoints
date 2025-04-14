package com.travel.controller;

import com.travel.entity.AttractionEntity;
import com.travel.entity.ItemNotFoundException;
import com.travel.service.AttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


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
    public ResponseEntity<List<AttractionEntity>> getAllAdmins() {
        List<AttractionEntity> admins = attractionService.getAllAttractions();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    @GetMapping("find/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable("id") Long id) {
        try {
            Optional<AttractionEntity> attractionEntity = attractionService.getAttractionById(id);
            return new ResponseEntity<>(attractionEntity, HttpStatus.OK);
        } catch (ItemNotFoundException e) {
            return new ResponseEntity<>("Attraction with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAdmin(@RequestBody AttractionEntity attractionEntity) {
        try {
            AttractionEntity saved = attractionService.updateOrAddAttraction(attractionEntity);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Missing required fields", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateAttraction(@RequestBody AttractionEntity attractionEntity) {
        try {
            Optional<AttractionEntity> existing = attractionService.getAttractionById(attractionEntity.getId());
            if (existing.isEmpty()) {
                return new ResponseEntity<>("Attraction with id: " + attractionEntity.getId() + " not found", HttpStatus.NOT_FOUND);
            }
            AttractionEntity updated = attractionService.updateOrAddAttraction(attractionEntity);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


}
