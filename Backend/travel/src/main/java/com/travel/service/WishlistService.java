package com.travel.service;

import com.travel.dtos.WishlistRequestDTO;
import com.travel.dtos.WishlistResponseDTO;
import com.travel.entity.AttractionEntity;
import com.travel.entity.UserEntity;
import com.travel.entity.WishlistEntity;
import com.travel.mapper.WishlistMapper;
import com.travel.repository.AttractionRepository;
import com.travel.repository.UserRepository;
import com.travel.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistMapper wishlistMapper;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;

    @Autowired
    public WishlistService(
            WishlistRepository wishlistRepository,
            WishlistMapper wishlistMapper,
            UserRepository userRepository,
            AttractionRepository attractionRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistMapper = wishlistMapper;
        this.userRepository = userRepository;
        this.attractionRepository = attractionRepository;
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

    public WishlistResponseDTO getWishlistById(Long id) {
        Optional<WishlistEntity> result = wishlistRepository.findById(id);
        if(result.isEmpty()){
            throw new NoSuchElementException("The wishlist with the id: " + id + " does not exist");
        }
        return wishlistMapper.toDTO(result.get());
    }

    public List<WishlistResponseDTO> getAllWishlists() {
        return wishlistRepository.findAll().stream().map(wishlist -> wishlistMapper.toDTO(wishlist)).toList();
    }

    public WishlistResponseDTO getWishlistByAttractionIdAndUserId(Long attractionId, Long userId) {
        Optional<WishlistEntity> result = wishlistRepository.findByAttractionIdAndUserId(attractionId, userId);
        if(result.isEmpty()){
            throw new NoSuchElementException("The wishlist of user with the id:" + userId + "does not contains the attraction with the id: " + attractionId);
        }
        return wishlistMapper.toDTO(result.get());
    }
    
    public WishlistResponseDTO addWishlist(WishlistRequestDTO wishlistRequestDTO) {
        WishlistEntity wishlist = wishlistMapper.toEntity(wishlistRequestDTO);
        Optional<WishlistEntity> exist = wishlistRepository.findByAttractionIdAndUserId(wishlistRequestDTO.getAttractionId(), wishlistRequestDTO.getUserId());
        if(exist.isPresent()){
            throw new RuntimeException("User with id: " + wishlistRequestDTO.getUserId() + " already added the attraction with id: " + wishlistRequestDTO.getAttractionId() + "to wishlist");
        }
        wishlist.setAttraction(checkAttraction(wishlistRequestDTO.getAttractionId()));
        wishlist.setUser(checkUser(wishlistRequestDTO.getUserId()));
        return wishlistMapper.toDTO(wishlistRepository.save(wishlist));
    }

    public void deleteWishlist(Long id) {
        if(!wishlistRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist not found");
        }
        wishlistRepository.deleteById(id);
    }
}
