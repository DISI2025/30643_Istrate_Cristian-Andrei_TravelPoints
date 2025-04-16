package com.travel.dtos;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class AttractionRequestDTO {
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
