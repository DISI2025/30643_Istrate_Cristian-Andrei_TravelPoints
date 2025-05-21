package com.travel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VisitTopStatsDTO {
    private String name;
    private Long visitsCount;
}
