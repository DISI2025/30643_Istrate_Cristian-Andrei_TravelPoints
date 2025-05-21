package com.travel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class VisitTopStatsResponseDTO {
    private List<VisitTopStatsDTO> topAttractions;
    private List<VisitTopStatsDTO> topLocations;
}
