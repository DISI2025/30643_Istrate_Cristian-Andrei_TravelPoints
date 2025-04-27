package com.travel.dtos;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

public class AttractionRequestDTO {
    @NotNull
    private String name;
    @NotNull
    private String descriptionText;
    @NotNull
    private String descriptionAudio;
    @NotNull
    private String location;
    @NotNull
    private String offers;
    @NotNull
    private String category;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    @NotNull
    private Double price;
    @NotNull
    private Double oldPrice;

}
