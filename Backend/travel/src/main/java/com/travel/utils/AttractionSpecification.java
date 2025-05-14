package com.travel.utils;

import com.travel.entity.AttractionEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AttractionSpecification {

    public static Specification<AttractionEntity> filterBy(
            String name,
            String location,
            String category,
            Double minPrice,
            Double maxPrice
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.equal(root.get("location"), location));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (minPrice != null && maxPrice != null) {
                predicates.add(cb.between(root.get("price"), minPrice, maxPrice));
            }

            // combine with AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
