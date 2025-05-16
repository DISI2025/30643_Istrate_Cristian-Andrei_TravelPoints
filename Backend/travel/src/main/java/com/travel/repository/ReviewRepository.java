package com.travel.repository;

import com.travel.entity.ReviewEntity;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {


    Optional<ReviewEntity> findById(Long id);
    Optional<ReviewEntity> findByUserIdAndAttractionId(Long userId, Long attractionId);

    List<ReviewEntity> findAllByAttractionId(Long attractionId);
}
