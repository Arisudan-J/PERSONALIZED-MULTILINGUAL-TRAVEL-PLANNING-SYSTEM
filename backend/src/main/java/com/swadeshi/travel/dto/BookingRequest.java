package com.swadeshi.travel.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long destinationId;
    private String travelType;
    private List<Long> selectedPlaceIds;
}
