package com.swadeshi.travel.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long bookingId;
    private String upiId;
}
