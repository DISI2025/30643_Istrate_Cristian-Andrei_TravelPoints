package com.travel.service;

import com.travel.dtos.AttractionResponseDTO;
import com.travel.dtos.MongoAttractionDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.MongoAttractionEntity;
import com.travel.repository.AttractionRepository;
import com.travel.repository.MongoAttractionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.query.NearQuery;
import org.springframework.data.redis.domain.geo.Metrics;
import org.springframework.stereotype.Service;
import org.springframework.data.geo.Point;

import java.util.List;


@Service
public class MongoAttractionService {
    private final AttractionRepository attractionRepository;
    private final MongoAttractionRepository mongoAttractionRepository;

    private final MongoTemplate mongoTemplate;

    @Autowired
    public MongoAttractionService(AttractionRepository attractionRepository, MongoAttractionRepository mongoAttractionRepository, MongoTemplate mongoTemplate) {
        this.attractionRepository = attractionRepository;
        this.mongoAttractionRepository = mongoAttractionRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    private void syncAttractionsToMongo() {
        List<AttractionEntity> attractions = attractionRepository.findAll();

        for (AttractionEntity a : attractions) {
            MongoAttractionEntity geo = new MongoAttractionEntity();
            geo.setId(a.getId());
            geo.setName(a.getName());
            geo.setLatitude(a.getLatitude());
            geo.setLongitude(a.getLongitude());
            geo.setLocation(new GeoJsonPoint(a.getLongitude(),a.getLatitude()));

            mongoAttractionRepository.save(geo);
        }

        System.out.println("Attractions synced to MongoDB.");
    }

    public void deleteAttraction(Long id){
        mongoAttractionRepository.deleteById(id);
    }

    public void addAttraction(AttractionResponseDTO attraction){
        MongoAttractionEntity result =  new MongoAttractionEntity();
        result.setId(attraction.getId());
        result.setName(attraction.getName());
        result.setLatitude(attraction.getLatitude());
        result.setLongitude(attraction.getLongitude());
        result.setLocation(new GeoJsonPoint(attraction.getLongitude(),attraction.getLatitude()));
        mongoAttractionRepository.save(result);
    }

    public List<MongoAttractionDTO> findNearby(Double lat, Double lng, double radiusMeters) {
        NearQuery nearQuery = NearQuery
                .near(new Point(lng, lat), Metrics.METERS)
                .maxDistance(new Distance(radiusMeters, Metrics.METERS))
                .limit(50)
                .spherical(true);

        return mongoTemplate
                .geoNear(nearQuery, MongoAttractionEntity.class)
                .getContent()
                .stream()
                .map(hit -> new MongoAttractionDTO(
                        hit.getContent().getId(),
                        hit.getContent().getName(),
                        hit.getContent().getLongitude(),
                        hit.getContent().getLatitude(),
                        hit.getDistance().getValue()
                ))
                .toList();
    }

}
