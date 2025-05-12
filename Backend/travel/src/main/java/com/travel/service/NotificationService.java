package com.travel.service;


import com.travel.dtos.*;
import com.travel.entity.AttractionEntity;
import com.travel.entity.NotificationEntity;
import com.travel.entity.UserEntity;
import com.travel.mapper.AttractionMapper;
import com.travel.mapper.NotificationMapper;
import com.travel.repository.AttractionRepository;
import com.travel.repository.NotificationRepository;
import com.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * notification service class
 * calls all the methods needed already implemented
 * in the notification interface
 */
@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, NotificationMapper notificationMapper, AttractionRepository attractionRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.attractionRepository = attractionRepository;
        this.userRepository = userRepository;
    }

    private UserEntity checkUser(Long userId) {
        Optional<UserEntity> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User with id: " + userId + " does not exist");
        }
        return user.get();
    }

    private AttractionEntity checkAttraction(Long attractionId) {
        Optional<AttractionEntity> attraction = attractionRepository.findAttractionById(attractionId);
        if (attraction.isEmpty()) {
            throw new RuntimeException("Attraction with id: " + attractionId + " does not exist");
        }
        return attraction.get();
    }

    public NotificationResponseDTO getNotificationById(Long id) {
        Optional<NotificationEntity> result = notificationRepository.findById(id);

        return notificationMapper.toDTO(result.get());
    }

    public List<NotificationResponseDTO> getAllNotifications() {
        return notificationRepository.findAll().stream().map(notifcation -> notificationMapper.toDTO(notifcation)).toList();
    }


    public List<NotificationResponseDTO> getAllNotificationsOfUser(Long userId) {
        return notificationRepository.getAllByUserId(userId).stream().map(notification -> notificationMapper.toDTO(notification)).toList();
    }

    public NotificationResponseDTO addNotification(NotificationRequestDTO notification) {
        NotificationEntity existing = notificationMapper.toEntity(notification);
        existing.setAttraction(checkAttraction(notification.getAttractionId()));
        existing.setUser(checkUser(notification.getUserId()));
        return notificationMapper.toDTO(notificationRepository.save(existing));
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}

