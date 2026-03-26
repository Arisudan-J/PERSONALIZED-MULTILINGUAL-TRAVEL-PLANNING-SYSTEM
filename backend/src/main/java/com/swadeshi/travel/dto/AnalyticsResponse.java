package com.swadeshi.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalUsers;
    private long totalDestinations;
    private long totalBookings;
    private double totalRevenue;
    private long activeOffers;
    private String mostBookedDestination;
    private Map<String, Long> travelTypeDistribution;
    private Map<String, Long> monthlyBookings;
}
