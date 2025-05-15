package com.travel.service;

import com.travel.dtos.ReviewRequestDTO;
import com.travel.dtos.ReviewResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.ReviewEntity;
import com.travel.entity.UserEntity;
import com.travel.mapper.ReviewMapper;
import com.travel.repository.AttractionRepository;
import com.travel.repository.ReviewRepository;
import com.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ReviewMapper reviewMapper, UserRepository userRepository, AttractionRepository attractionRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
        this.userRepository = userRepository;
        this.attractionRepository = attractionRepository;
    }

    public ReviewResponseDTO addReview(Long userId, ReviewRequestDTO reviewRequestDTO) {
        Optional<UserEntity> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User with ID: " + userId + "does not exists");
        }
        Optional<AttractionEntity> optionalAttraction = attractionRepository.findById(reviewRequestDTO.getAttractionId());
        if (optionalAttraction.isEmpty()) {
            throw new RuntimeException("Attraction with ID: " + reviewRequestDTO.getAttractionId() + "does not exists");

        }

        ReviewEntity review = reviewMapper.toEntity(reviewRequestDTO);
        review.setUser(optionalUser.get());
        review.setAttraction(optionalAttraction.get());
        review.setCreatedAt(new Date(System.currentTimeMillis()));

        return reviewMapper.toDTO(reviewRepository.save(review));
    }
}
