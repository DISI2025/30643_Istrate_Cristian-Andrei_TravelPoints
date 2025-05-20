package com.travel.service;

import com.travel.dtos.ContactMessageRequestDTO;
import com.travel.entity.ContactMessageEntity;
import com.travel.entity.UserEntity;
import com.travel.mapper.ContactMessageMapper;
import com.travel.repository.ContactMessageRepository;
import com.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;
    private final ContactMessageMapper contactMessageMapper;

    private final EmailService emailService;

    @Value("${mail.to}")
    private String toEmail;

    public ContactMessageService(ContactMessageRepository contactMessageRepository,
                                 UserRepository userRepository,
                                 ContactMessageMapper contactMessageMapper, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.userRepository = userRepository;
        this.contactMessageMapper = contactMessageMapper;
        this.emailService = emailService;
    }

    public void addMessage(ContactMessageRequestDTO dto) {
        Optional<UserEntity> optionalUser = userRepository.findById(dto.getUserId());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User with ID " + dto.getUserId() + " does not exist.");
        }

        ContactMessageEntity entity = contactMessageMapper.toEntity(dto);
        entity.setUser(optionalUser.get());
        contactMessageRepository.save(entity);

        try {
            emailService.sendSimpleEmail(
                    toEmail,
                    dto.getSubject(),
                    dto.getMessage()
            );
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }
    }
}
