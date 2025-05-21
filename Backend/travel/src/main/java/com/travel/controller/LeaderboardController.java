package com.travel.controller;

import com.travel.dtos.AttractionResponseDTO;
import com.travel.dtos.LeaderboardDTO;
import com.travel.service.AttractionService;
import com.travel.service.LeaderboardCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private LeaderboardCache leaderboardCache;

    private AttractionService attractionService;

    @Autowired
    public LeaderboardController(LeaderboardCache leaderboardCache, AttractionService attractionService) {
        this.attractionService = attractionService;
        this.leaderboardCache = leaderboardCache;
    }

    @GetMapping
    public List<LeaderboardDTO> getTop() {
        return leaderboardCache.getTop(10).stream()
                .map(tuple -> {
                    Long id = Long.parseLong(tuple.getValue());
                    String name = attractionService.getAttractionById(id).getName();
                    Double score = tuple.getScore();
                    return new LeaderboardDTO(id, name, score);
                })
                .toList();
    }
}

