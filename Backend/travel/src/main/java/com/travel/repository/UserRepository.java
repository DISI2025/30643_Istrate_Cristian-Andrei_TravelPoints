package com.travel.repository;

import com.travel.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsById(Long id);
    boolean existsByEmail(String email);
}
