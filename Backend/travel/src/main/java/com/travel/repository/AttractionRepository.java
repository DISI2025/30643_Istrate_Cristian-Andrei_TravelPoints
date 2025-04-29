package com.travel.repository;


import com.travel.entity.AttractionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * interface contains the implemented methods in JpaRepository
 * needed for the CRUD operations on the attractions table
 */
@Repository
public interface AttractionRepository extends JpaRepository<AttractionEntity,Long> {
    Optional<AttractionEntity> findAttractionById(Long id);

    List<AttractionEntity> findByLocation(String location);

    List<AttractionEntity> findByCategory(String category);

    List<AttractionEntity> findByNameContainingIgnoreCase(String name);

    List<AttractionEntity> findByPriceBetween(Double minPrice, Double maxPrice);
}
