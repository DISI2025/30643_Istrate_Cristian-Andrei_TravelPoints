package com.travel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardDTO {
    private Long id;
    private String attractionName;
    private Double score;
}
