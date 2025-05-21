package com.travel.service;

import com.fasterxml.jackson.databind.ser.std.StdArraySerializers;
import com.travel.dtos.VisitRequestDTO;
import com.travel.dtos.VisitResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.UserEntity;
import com.travel.entity.VisitEntity;
import com.travel.mapper.VisitMapper;
import com.travel.repository.AttractionRepository;
import com.travel.repository.UserRepository;
import com.travel.repository.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@Service
public class VisitService {
    private final VisitRepository visitRepository;
    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;
    private final VisitMapper visitMapper;
    private  final LeaderboardCache leaderboardCache;

    @Autowired
    public VisitService(VisitRepository visitRepository, VisitMapper visitMapper, AttractionRepository attractionRepository, UserRepository userRepository, LeaderboardCache leaderboardCache) {
        this.visitRepository = visitRepository;
        this.attractionRepository = attractionRepository;
        this.userRepository = userRepository;
        this.visitMapper = visitMapper;
        this.leaderboardCache = leaderboardCache;
    }

    private UserEntity checkUser(Long userId){
        Optional<UserEntity> user = userRepository.findById(userId);
        if(user.isEmpty()){
            throw new RuntimeException("User with id: " + userId + " does not exist");
        }
        return user.get();
    }

    private AttractionEntity checkAttraction(Long attractionId){
        Optional<AttractionEntity> attraction = attractionRepository.findAttractionById(attractionId);
        if(attraction.isEmpty()){
            throw new RuntimeException("Attraction with id: " + attractionId + " does not exist");
        }
        return attraction.get();
    }

    public VisitResponseDTO getVisitById(Long id) {
        Optional<VisitEntity> result = visitRepository.findVisitEntityById(id);
        if(result.isEmpty()){
            throw new NoSuchElementException("The visit with the id: " + id + " does not exist");
        }
        return visitMapper.toDTO(result.get());
    }

    public List<VisitResponseDTO> getAllVisits() {
        return visitRepository.findAll().stream().map(visit -> visitMapper.toDTO(visit)).toList();
    }

    public VisitResponseDTO addVisit(VisitRequestDTO visitRequestDTO) {
        VisitEntity visit = visitMapper.toEntity(visitRequestDTO);
        Optional<VisitEntity> exist = visitRepository.findVisitEntityByAttractionIdAndUserId(visitRequestDTO.getAttractionId(),visitRequestDTO.getUserId());
        if(exist.isPresent()){
            throw new RuntimeException("User with id: " + visitRequestDTO.getUserId() + " already visited the attraction with id: " + visitRequestDTO.getAttractionId());
        }
        visit.setAttraction(checkAttraction(visitRequestDTO.getAttractionId()));
        visit.setUser(checkUser(visitRequestDTO.getUserId()));
        leaderboardCache.incrementScore(visitRequestDTO.getAttractionId(), 1);
        return visitMapper.toDTO(visitRepository.save(visit));
    }

    public VisitResponseDTO updateVisit(Long id, VisitRequestDTO visitRequestDTO) {
        VisitEntity visit = visitMapper.toEntity(visitRequestDTO);

        visit.setAttraction(checkAttraction(visitRequestDTO.getAttractionId()));
        visit.setUser(checkUser(visitRequestDTO.getUserId()));
        visit.setId(id);
        return visitMapper.toDTO(visitRepository.save(visit));
    }

    public void deleteVisit(Long id) {
        this.getVisitById(id);
        visitRepository.deleteById(id);
    }

    public List<VisitResponseDTO> getAttractionVisits(Long attractionId){
        checkAttraction(attractionId);
        List<VisitEntity> result = visitRepository.findVisitEntitiesByAttractionId(attractionId);
        return result.stream().map(visit -> visitMapper.toDTO(visit)).toList();
    }

    public List<VisitResponseDTO> getUserVisits(Long userId){
        checkUser(userId);
        List<VisitEntity> result = visitRepository.findVisitEntitiesByUserId(userId);
        return result.stream().map(visit -> visitMapper.toDTO(visit)).toList();
    }

    public VisitResponseDTO getUserAndAttractionVisit(Long attractionId, Long userId){
        Optional<VisitEntity> result = visitRepository.findVisitEntityByAttractionIdAndUserId(attractionId,userId);
        checkAttraction(attractionId);
        checkUser(userId);
        return result.isPresent() ? visitMapper.toDTO(result.get()) : null;
    }
}
