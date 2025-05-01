package com.travel.dtos;

import lombok.Data;

import java.util.List;

@Data
public class AttractionPageResponseDTO {
    private List<AttractionResponseDTO> content;
    private int numberOfElements;
}
