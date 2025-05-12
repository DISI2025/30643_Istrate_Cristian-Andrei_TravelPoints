package com.travel.controller;

import com.travel.dtos.*;
import com.travel.entity.AttractionEntity;
import com.travel.exceptions.ItemNotFoundException;
import com.travel.mapper.AttractionMapper;
import com.travel.service.AttractionService;
import com.travel.service.NotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


// port 8081 is assigned FOR NOW to be the port for the frontend server
// @CrossOrigin(origins = "http://localhost:<frontend-port>")
@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/notification")
@Validated
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {
        List<NotificationResponseDTO> notifications = notificationService.getAllNotifications();
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotificationsOfUser(@PathVariable Long id) {
        List<NotificationResponseDTO> notifications = notificationService.getAllNotificationsOfUser(id);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping("find/{id}")
    public ResponseEntity<?> getNotificationById(@PathVariable("id") Long id) {
        try {
            NotificationResponseDTO existing = notificationService.getNotificationById(id);
            return new ResponseEntity<>(existing, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Notification with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAttraction(@Valid @RequestBody NotificationRequestDTO notificationRequestDTO) {
        try {
            NotificationResponseDTO saved = notificationService.addNotification(notificationRequestDTO);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Missing required field: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable("id") Long id) {
        try {
            notificationService.deleteNotification(id);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Notification with id: " + id + " not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
