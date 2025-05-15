package com.travel.repository;

import com.travel.entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, Long> {

    Optional<WishlistEntity> findById(Long id);
    Optional<WishlistEntity> findByAttractionIdAndUserId(Long attractionId, Long userId);
    List<WishlistEntity> findByAttractionId(Long attractionId);
}
