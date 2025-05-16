package com.travel.dtos;

import lombok.Data;

import java.util.List;
@Data

public class AttractionPageResponseDTOPagination {

    private List<AttractionResponseDTO> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;


}
