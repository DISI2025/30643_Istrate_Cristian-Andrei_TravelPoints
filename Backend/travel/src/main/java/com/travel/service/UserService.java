package com.travel.service;

import com.travel.dtos.LoginRequestDTO;
import com.travel.entity.UserEntity;
import com.travel.mapper.UserMapper;
import com.travel.dtos.UserRequestDTO;
import com.travel.dtos.UserResponseDTO;
import org.springframework.http.HttpStatus;
import com.travel.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserResponseDTO addUser(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        UserEntity user = userMapper.toEntity(userRequestDTO);
        return userMapper.toDTO(userRepository.save(user));
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDTO).toList();
    }

    public UserResponseDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userRequestDTO.getName());
                    user.setEmail(userRequestDTO.getEmail());
                    if (userRequestDTO.getPassword() != null) {
                        user.setPassword(userRequestDTO.getPassword());
                    }
                    return userMapper.toDTO(userRepository.save(user));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    public UserResponseDTO loginUser(LoginRequestDTO loginRequest) {
        UserEntity user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return userMapper.toDTO(user);
    }
}
