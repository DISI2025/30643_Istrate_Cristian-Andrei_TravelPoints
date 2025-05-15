package com.travel.dtos;

import lombok.Data;

import java.util.List;

@Data
public class VisitTopStatsResponseDTO {
    private List<VisitTopAttractionDTO> topAttractions;
    private List<VisitTopLocationDTO> topLocations;

    public VisitTopStatsResponseDTO(List<VisitTopAttractionDTO> topAttractions, List<VisitTopLocationDTO> topLocations) {
        this.topAttractions = topAttractions;
        this.topLocations = topLocations;
    }
}
