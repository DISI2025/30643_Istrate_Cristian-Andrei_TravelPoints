package com.travel.service;

import com.travel.dtos.VisitStatisticsDTO;
import com.travel.repository.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class VisitStatisticsService {

    private final VisitRepository visitRepository;

    @Autowired
    public VisitStatisticsService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    public List<Long> getVisitsByHour(){
        List<VisitStatisticsDTO> results = visitRepository.countVisitsGroupedByHour();

        Long[] visits = new Long[24];
        Arrays.fill(visits, 0L);

        for (VisitStatisticsDTO r : results) {
            visits[r.getTime()] = r.getNumber();
        }

        return Arrays.asList(visits);
    }

    public List<Long> getVisitsByMonth() {
        List<VisitStatisticsDTO> results = visitRepository.countVisitsGroupedByMonth();

        Long[] visits = new Long[12];
        Arrays.fill(visits, 0L);

        for (VisitStatisticsDTO r : results) {
            visits[r.getTime() - 1] = r.getNumber();
        }

        return Arrays.asList(visits);
    }
}
