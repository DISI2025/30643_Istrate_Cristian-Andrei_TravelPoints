package com.travel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class VisitTopStatsResponseDTO {
    private List<VisitTopAttractionDTO> topAttractions;
    private List<VisitTopLocationDTO> topLocations;
}
