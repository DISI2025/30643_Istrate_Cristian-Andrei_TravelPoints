package com.travel.repository;

import com.travel.entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistEntity, Long> {

    Optional<WishlistEntity> findById(Long id);
}
