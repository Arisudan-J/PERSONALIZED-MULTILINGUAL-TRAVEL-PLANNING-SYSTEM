package com.swadeshi.travel.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingSummaryResponse {
    private Long bookingId;
    private String destinationName;
    private String travelType;
    private List<PlaceDto> selectedPlaces;
    private Double originalCost;
    private Double discountPercent;
    private Double discountAmount;
    private Double totalCost;
    private Double totalDurationHours;
    private String paymentStatus;
    private String bookingDate;
}
