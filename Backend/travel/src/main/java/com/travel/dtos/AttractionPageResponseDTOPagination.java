package com.travel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
@Data
@AllArgsConstructor
public class AttractionPageResponseDTOPagination {

    private List<AttractionResponseDTO> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;


}
