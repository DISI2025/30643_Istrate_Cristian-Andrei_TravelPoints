package com.travel.service;

import com.travel.dtos.ContactMessageRequestDTO;
import com.travel.entity.ContactMessageEntity;
import com.travel.entity.UserEntity;
import com.travel.mapper.ContactMessageMapper;
import com.travel.repository.ContactMessageRepository;
import com.travel.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;
    private final ContactMessageMapper contactMessageMapper;

    public ContactMessageService(ContactMessageRepository contactMessageRepository,
                                 UserRepository userRepository,
                                 ContactMessageMapper contactMessageMapper) {
        this.contactMessageRepository = contactMessageRepository;
        this.userRepository = userRepository;
        this.contactMessageMapper = contactMessageMapper;
    }

    public void addMessage(ContactMessageRequestDTO dto) {
        Optional<UserEntity> optionalUser = userRepository.findById(dto.getUserId());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User with ID " + dto.getUserId() + " does not exist.");
        }

        ContactMessageEntity entity = contactMessageMapper.toEntity(dto);
        entity.setUser(optionalUser.get());
        contactMessageRepository.save(entity);
    }
}
