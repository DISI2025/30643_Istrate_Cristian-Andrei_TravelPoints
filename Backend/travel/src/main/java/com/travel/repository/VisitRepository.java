package com.travel.repository;

import com.travel.dtos.VisitStatisticsDTO;
import com.travel.entity.VisitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<VisitEntity,Long> {
    Optional<VisitEntity> findVisitEntityById(Long id);
    List<VisitEntity> findVisitEntitiesByUserId(Long userId);

    List<VisitEntity> findVisitEntitiesByAttractionId(Long attractionId);

    Optional<VisitEntity> findVisitEntityByAttractionIdAndUserId(Long attractionId, Long userId);

    @Query(value = "SELECT CAST(EXTRACT(HOUR FROM visit_timestamp) AS int) AS time, COUNT(*) AS number " +
            "FROM visits GROUP BY time ORDER BY time", nativeQuery = true)
    List<VisitStatisticsDTO> countVisitsGroupedByHour();

    @Query(value = "SELECT CAST(EXTRACT(MONTH FROM visit_timestamp) AS int) AS time, COUNT(*) AS number " +
            "FROM visits GROUP BY time ORDER BY time", nativeQuery = true)
    List<VisitStatisticsDTO> countVisitsGroupedByMonth();
}
