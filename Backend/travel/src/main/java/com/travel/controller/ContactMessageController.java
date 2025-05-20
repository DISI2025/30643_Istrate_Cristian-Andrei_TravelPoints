package com.travel.controller;

import com.travel.dtos.ContactMessageRequestDTO;
import com.travel.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping("/contact")
    public ResponseEntity<Void> createMessage(@Valid @RequestBody ContactMessageRequestDTO dto) {
        contactMessageService.addMessage(dto);
        return ResponseEntity.ok().build();
    }
}
