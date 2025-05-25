package com.travel.service;

import com.travel.dtos.AttractionResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.MongoAttractionEntity;
import com.travel.repository.AttractionRepository;
import com.travel.repository.MongoAttractionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class MongoAttractionService {
    private final AttractionRepository attractionRepository;
    private final MongoAttractionRepository mongoAttractionRepository;

    @Autowired
    public MongoAttractionService(AttractionRepository attractionRepository, MongoAttractionRepository mongoAttractionRepository) {
        this.attractionRepository = attractionRepository;
        this.mongoAttractionRepository = mongoAttractionRepository;
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
        mongoAttractionRepository.save(result);
    }

}
