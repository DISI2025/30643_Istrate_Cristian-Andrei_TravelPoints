package com.travel.dtos;

import java.util.List;

public class AttractionPageResponseDTOPagination {

    private List<AttractionResponseDTO> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;

    public AttractionPageResponseDTOPagination() {
    }

    public AttractionPageResponseDTOPagination(List<AttractionResponseDTO> content, int totalPages, long totalElements, int currentPage) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
    }

    public List<AttractionResponseDTO> getContent() {
        return content;
    }

    public void setContent(List<AttractionResponseDTO> content) {
        this.content = content;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
}
