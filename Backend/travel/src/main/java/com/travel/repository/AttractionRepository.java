package com.travel.repository;


import com.travel.entity.AttractionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * interface contains the implemented methods in JpaRepository
 * needed for the CRUD operations on the attractions table
 */
@Repository
public interface AttractionRepository extends JpaRepository<AttractionEntity,Long> {
    Optional<AttractionEntity> findAttractionById(Long id);

}
