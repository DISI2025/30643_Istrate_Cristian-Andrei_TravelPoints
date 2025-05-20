package com.travel.repository;

import com.travel.dtos.VisitStatisticsDTO;
import com.travel.dtos.VisitTopStatsDTO;
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

    @Query(value = "SELECT a.name AS name, COUNT(*) AS visitsCount FROM visits v JOIN attractions a " +
            "ON v.attraction_id = a.id GROUP BY a.name ORDER BY visitsCount DESC", nativeQuery = true)
    List<VisitTopStatsDTO> findTopVisitedAttractions();

    @Query(value = "SELECT a.location AS location, COUNT(*) AS visits_count FROM visits v " +
            "JOIN attractions a ON v.attraction_id = a.id GROUP BY a.location ORDER BY visits_count DESC",
            nativeQuery = true)
    List<VisitTopStatsDTO> findTopVisitedLocations();
}
