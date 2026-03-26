package com.swadeshi.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "places")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "visit_duration_hours")
    private Double visitDurationHours;

    private String category;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;
}
