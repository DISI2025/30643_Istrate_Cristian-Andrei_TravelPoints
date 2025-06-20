package com.travel.controller;

import com.travel.dtos.WishlistRequestDTO;
import com.travel.dtos.WishlistResponseDTO;
import com.travel.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/wishlist")
@Validated
public class WishlistController {
    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping()
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<List<WishlistResponseDTO>> getAllWishlists() {
        List<WishlistResponseDTO> wishlists = wishlistService.getAllWishlists();
        return new ResponseEntity<>(wishlists, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> getWishlistById(@PathVariable("id") Long id) {
        try {
            WishlistResponseDTO existing = wishlistService.getWishlistById(id);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Wishlist with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> getWishlistByAttractionIdAndUserId(
            @RequestParam("attractionId") Long attractionId,
            @RequestParam("userId") Long userId
    ) {
        try {
            WishlistResponseDTO existing = wishlistService.getWishlistByAttractionIdAndUserId(attractionId, userId);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> addWishlist(@Valid @RequestBody WishlistRequestDTO wishlistRequestDTO) {
        try {
            WishlistResponseDTO saved = wishlistService.addWishlist(wishlistRequestDTO);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Missing required field: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    public ResponseEntity<?> deleteWishlist(@PathVariable("id") Long id) {
        try {
            wishlistService.deleteWishlist(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Wishlist with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
