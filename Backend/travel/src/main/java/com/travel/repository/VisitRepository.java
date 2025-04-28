package com.travel.repository;

import com.travel.entity.VisitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<VisitEntity,Long> {
    Optional<VisitEntity> findVisitEntityById(Long id);
    List<VisitEntity> findVisitEntitiesByUserId(Long userId);

    List<VisitEntity> findVisitEntitiesByAttractionId(Long attractionId);

    Optional<VisitEntity> findVisitEntityByAttractionIdAndUserId(Long attractionId, Long userId);
}
