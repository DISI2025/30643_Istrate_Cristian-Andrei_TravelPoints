package com.travel.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MongoAttractionDTO {
    private Long id;
    private String name;
    private Double longitude;
    private Double latitude;
    private Double distance;
}
