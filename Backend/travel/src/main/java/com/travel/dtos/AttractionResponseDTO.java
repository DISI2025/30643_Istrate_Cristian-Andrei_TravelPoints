package com.travel.dtos;
import lombok.Data;

@Data
public class AttractionResponseDTO {
    private Long id;
    private String name;
    private String descriptionText;
    private String descriptionAudio;
    private String location;
    private String offers;
    private String category;
    private double latitude;
    private double longitude;
    private double price;
    private double oldPrice;
}
