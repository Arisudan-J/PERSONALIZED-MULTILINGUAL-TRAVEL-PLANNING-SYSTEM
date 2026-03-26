package com.swadeshi.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "guides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String languages; // e.g. "Tamil, English, Hindi"

    private String contact; // Demo contact

    private String experience; // e.g. "5 years"

    @Column(name = "per_day_charge")
    private Double perDayCharge;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destination;
}
