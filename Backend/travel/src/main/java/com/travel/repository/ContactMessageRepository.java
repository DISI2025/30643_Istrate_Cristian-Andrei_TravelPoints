// ContactMessageRepository.java
package com.travel.repository;

import com.travel.entity.ContactMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessageEntity, Long> {
}
