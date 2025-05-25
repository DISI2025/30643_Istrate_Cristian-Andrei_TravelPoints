package com.travel.entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MongoAttractionEntity {
    @Id
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
}
