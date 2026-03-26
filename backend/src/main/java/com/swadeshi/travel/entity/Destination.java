package com.swadeshi.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "Ooty", "Jaipur", "Goa"

    private String state;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private String category; // e.g. "Hill Station", "Beach", "Heritage"

    @Column(name = "base_cost")
    private Double baseCost;

    private Boolean featured = false;
}
