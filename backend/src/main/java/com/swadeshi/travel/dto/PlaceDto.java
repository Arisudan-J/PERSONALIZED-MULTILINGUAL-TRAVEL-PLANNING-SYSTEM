package com.swadeshi.travel.dto;

import lombok.Data;

@Data
public class PlaceDto {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Double estimatedCost;
    private Double visitDurationHours;
    private String category;
}
