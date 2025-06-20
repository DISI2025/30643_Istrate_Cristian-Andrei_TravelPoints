package com.travel.controller;

import com.travel.dtos.*;
import com.travel.service.VisitService;
import com.travel.service.VisitStatisticsService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/visit")
public class VisitController {
    private final VisitService visitService;
    private final VisitStatisticsService visitStatisticsService;

    @Autowired
    public VisitController(VisitService visitService, VisitStatisticsService visitStatisticsService) {
        this.visitService = visitService;
        this.visitStatisticsService = visitStatisticsService;
    }

    @GetMapping("/all")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<List<VisitResponseDTO>> getAllVisits() {
        List<VisitResponseDTO> visits = visitService.getAllVisits();
        return new ResponseEntity<>(visits, HttpStatus.OK);
    }

    @GetMapping("/ofAttraction/{attractionId}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<List<VisitResponseDTO>> getVisitsOfAttraction(@PathVariable("attractionId") Long attractionId) {
        List<VisitResponseDTO> visits = visitService.getAttractionVisits(attractionId);
        return new ResponseEntity<>(visits, HttpStatus.OK);
    }

    @GetMapping("/ofUser/{userId}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<List<VisitResponseDTO>> getVisitsOfUser(@PathVariable("userId") Long userId) {
        List<VisitResponseDTO> visits = visitService.getUserVisits(userId);
        return new ResponseEntity<>(visits, HttpStatus.OK);
    }

    @GetMapping("/attractionAndUser/{attractionId}/{userId}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<VisitResponseDTO> getVisitOfUserAndAttraction(@PathVariable("userId") Long userId,@PathVariable("attractionId") Long attractionId) {
        VisitResponseDTO visit = visitService.getUserAndAttractionVisit(attractionId,userId);
        return new ResponseEntity<>(visit, HttpStatus.OK);
    }

    @GetMapping("find/{id}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> getVisitById(@PathVariable("id") Long id) {
        try {
            VisitResponseDTO existing = visitService.getVisitById(id);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Visit with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> addVisit(@Valid @RequestBody VisitRequestDTO visitRequestDTO) {
        try {
            VisitResponseDTO saved = visitService.addVisit(visitRequestDTO);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Missing required field: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> updateVisit(@PathVariable("id") Long id, @RequestBody VisitRequestDTO visitRequestDTO) {
        try {
            VisitResponseDTO existing = visitService.getVisitById(id);
            existing = visitService.updateVisit(id, visitRequestDTO);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Visit with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage() + " " + e.getClass().getName(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping("/delete/{id}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> deleteVisit(@PathVariable("id") Long id) {
        try {
            visitService.deleteVisit(id);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Visit with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/stats")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<VisitStatsResponseDTO> getVisitStats() {
        List<Long> byHour = visitStatisticsService.getVisitsByHour();
        List<Long> byMonth = visitStatisticsService.getVisitsByMonth();
        return ResponseEntity.ok(new VisitStatsResponseDTO(byHour, byMonth));
    }

    @GetMapping("/top-stats/{limit}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<VisitTopStatsResponseDTO> getTopAttractionsAndLocations(
            @PathVariable("limit") int limit) {

        List<VisitTopStatsDTO> topAttractions = visitStatisticsService.getTopVisitedAttractions(limit);
        List<VisitTopStatsDTO> topLocations = visitStatisticsService.getTopVisitedLocations(limit);

        return ResponseEntity.ok(new VisitTopStatsResponseDTO(topAttractions, topLocations));
    }
}