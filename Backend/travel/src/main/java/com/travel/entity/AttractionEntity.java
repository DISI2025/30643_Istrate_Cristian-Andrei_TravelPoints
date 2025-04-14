package com.travel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "attractions")
public class AttractionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String descriptionText;

    @Column(nullable = false)
    private String descriptionAudio;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String offers;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private double oldPrice;

}
