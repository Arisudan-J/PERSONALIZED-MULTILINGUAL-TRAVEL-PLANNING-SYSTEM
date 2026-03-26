package com.swadeshi.travel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class OfferRequest {
    private String name;
    private Double discountPercent;
    private Long destinationId;
    private LocalDate expiryDate;
    private String status;
}
