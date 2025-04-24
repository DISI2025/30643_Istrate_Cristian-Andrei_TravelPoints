package com.travel.repository;

import com.travel.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity,Long> {
    UserEntity getUserEntityByEmail(String email);
    boolean existsById(Long id);
    boolean existsByEmail(String email);
}
