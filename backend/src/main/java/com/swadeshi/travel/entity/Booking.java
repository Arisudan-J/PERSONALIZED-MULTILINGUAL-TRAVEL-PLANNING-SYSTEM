package com.swadeshi.travel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "travel_type")
    private String travelType; // Solo, Couple, Family, Business

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "original_cost")
    private Double originalCost;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "discount_percent")
    private Double discountPercent = 0.0;

    @Column(name = "total_duration_hours")
    private Double totalDurationHours;

    @Column(name = "selected_place_ids", columnDefinition = "TEXT")
    private String selectedPlaceIds; // Comma-separated IDs e.g. "1,3,5"

    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, SUCCESS, FAILED

    @Column(name = "upi_id")
    private String upiId; // Demo UPI ID

    @Column(name = "booking_date")
    private LocalDateTime bookingDate = LocalDateTime.now();

    @Column(name = "pdf_generated")
    private Boolean pdfGenerated = false;
}
