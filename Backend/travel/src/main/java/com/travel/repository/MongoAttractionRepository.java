package com.travel.repository;

import com.travel.entity.MongoAttractionEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MongoAttractionRepository extends MongoRepository<MongoAttractionEntity, Long> {
    Optional<MongoAttractionEntity> findById(Long id);
}
