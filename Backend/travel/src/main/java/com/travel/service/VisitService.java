package com.travel.service;

import com.travel.dtos.VisitRequestDTO;
import com.travel.dtos.VisitResponseDTO;
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


// TODO: need to add the check for existing user with userId  for add and update methods
// TODO: add method get visits of user and visit by attraction and user
@Service
public class VisitService {
    private final VisitRepository visitRepository;
    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;
    private final VisitMapper visitMapper;

    @Autowired
    public VisitService(VisitRepository visitRepository, VisitMapper visitMapper, AttractionRepository attractionRepository, UserRepository userRepository) {
        this.visitRepository = visitRepository;
        this.attractionRepository = attractionRepository;
        this.userRepository = userRepository;
        this.visitMapper = visitMapper;
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
        Long attractionId = visitRequestDTO.getAttraction().getId();
        Long userId = visitRequestDTO.getUser().getId();
        if(attractionRepository.findAttractionById(attractionId).isEmpty()){
            throw new RuntimeException("Attraction with id: " + attractionId + " does not exist");
        }
        if(userRepository.existsById(userId)){
            throw new RuntimeException("User with id: " + userId + " does not exist");
        }
        return visitMapper.toDTO(visitRepository.save(visitMapper.toEntity(visitRequestDTO)));
    }

    public VisitResponseDTO updateVisit(Long id, VisitRequestDTO visitRequestDTO) {
        VisitEntity visitEntity = visitMapper.toEntity(visitRequestDTO);
        Long attractionId = visitRequestDTO.getAttraction().getId();
        Long userId = visitRequestDTO.getUser().getId();
        if(attractionRepository.findAttractionById(attractionId).isEmpty()){
            throw new RuntimeException("Attraction with id: " + attractionId + " does not exist");
        }
        if(userRepository.existsById(userId)){
            throw new RuntimeException("User with id: " + userId + " does not exist");
        }
        visitEntity.setId(id);
        return visitMapper.toDTO(visitRepository.save(visitEntity));
    }

    public void deleteVisit(Long id) {
        this.getVisitById(id);
        visitRepository.deleteById(id);
    }

    public List<VisitResponseDTO> getAttractionVisits(Long attractionId){
        List<VisitEntity> result = visitRepository.findVisitEntitiesByAttractionId(attractionId);
        return result.stream().map(visit -> visitMapper.toDTO(visit)).toList();
    }

    public List<VisitResponseDTO> getUserVisits(Long userId){
        List<VisitEntity> result = visitRepository.findVisitEntitiesByUserId(userId);
        return result.stream().map(visit -> visitMapper.toDTO(visit)).toList();
    }

    public List<VisitResponseDTO> getUserAndAttractionVisit(Long attractionId, Long userId){
        Optional<VisitEntity> result = visitRepository.findVisitEntityByAttractionIdAndUserId(attractionId,userId);
        if(result.isEmpty()){
            throw new RuntimeException("Visit with userId: " + userId + " and attractionId: " + attractionId + " does not exist");
        }
        return result.stream().map(visit -> visitMapper.toDTO(visit)).toList();
    }
}
