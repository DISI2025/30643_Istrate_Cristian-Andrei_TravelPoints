package com.travel.dtos;

import lombok.Data;

import java.util.List;

@Data
public class VisitStatsResponseDTO {
    private List<Long> visitsByHour;
    private List<Long> visitsByMonth;

    public VisitStatsResponseDTO(List<Long> visitsByHour, List<Long> visitsByMonth) {
        this.visitsByHour = visitsByHour;
        this.visitsByMonth = visitsByMonth;
    }
}
