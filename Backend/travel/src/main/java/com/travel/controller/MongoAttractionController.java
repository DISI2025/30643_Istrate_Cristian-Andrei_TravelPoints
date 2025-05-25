package com.travel.controller;

import com.travel.dtos.MongoAttractionDTO;
import com.travel.service.MongoAttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/proximity")
public class MongoAttractionController {
    private final MongoAttractionService mongoAttractionService;

    @Autowired
    public MongoAttractionController(MongoAttractionService mongoAttractionService) {
        this.mongoAttractionService = mongoAttractionService;
    }

    @GetMapping("/attractions")
    public List<MongoAttractionDTO> getNearbyAttractions(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius
    ) {
        return mongoAttractionService.findNearby(lat, lng, radius);
    }
}
