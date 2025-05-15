package com.travel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class VisitStatsResponseDTO {
    private List<Long> visitsByHour;
    private List<Long> visitsByMonth;
}
