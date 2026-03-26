package com.swadeshi.travel.service;

import com.swadeshi.travel.dto.*;
import com.swadeshi.travel.entity.*;
import com.swadeshi.travel.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private OfferRepository offerRepository;

    // Create a booking with selected places
    public BookingSummaryResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination not found!"));

        // Fetch selected places
        List<Place> selectedPlaces = placeRepository.findByIdIn(request.getSelectedPlaceIds());

        // Calculate totals
        double totalCost = selectedPlaces.stream()
                .mapToDouble(Place::getEstimatedCost)
                .sum();
        double totalDuration = selectedPlaces.stream()
                .mapToDouble(Place::getVisitDurationHours)
                .sum();

        // Auto-apply best active offer for this destination
        double originalCost = totalCost;
        double discountPercent = 0.0;
        double discountAmount = 0.0;
        Optional<Offer> offer = offerRepository.findBestActiveOfferForDestination(
                destination.getId(), LocalDate.now());
        if (offer.isPresent()) {
            discountPercent = offer.get().getDiscountPercent();
            discountAmount = originalCost * (discountPercent / 100.0);
            totalCost = originalCost - discountAmount;
        }

        // Convert IDs list to comma-separated string
        String placeIdsStr = request.getSelectedPlaceIds().stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        // Save booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setDestination(destination);
        booking.setTravelType(request.getTravelType());
        booking.setTotalCost(totalCost);
        booking.setOriginalCost(originalCost);
        booking.setDiscountPercent(discountPercent);
        booking.setDiscountAmount(discountAmount);
        booking.setTotalDurationHours(totalDuration);
        booking.setSelectedPlaceIds(placeIdsStr);
        booking.setPaymentStatus("PENDING");

        Booking saved = bookingRepository.save(booking);

        return buildSummaryResponse(saved, selectedPlaces);
    }

    // Get all bookings for a user
    public List<BookingSummaryResponse> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        return bookings.stream()
                .map(b -> {
                    List<Long> ids = parseIds(b.getSelectedPlaceIds());
                    List<Place> places = placeRepository.findByIdIn(ids);
                    return buildSummaryResponse(b, places);
                })
                .collect(Collectors.toList());
    }

    // Get a single booking by ID
    public BookingSummaryResponse getBookingById(Long bookingId) {
        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
        List<Long> ids = parseIds(b.getSelectedPlaceIds());
        List<Place> places = placeRepository.findByIdIn(ids);
        return buildSummaryResponse(b, places);
    }

    // Process demo payment
    public BookingSummaryResponse processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        // Demo: Validate UPI format (just check it contains @)
        String upiId = request.getUpiId();
        if (upiId != null && upiId.contains("@")) {
            booking.setUpiId(upiId);
            booking.setPaymentStatus("SUCCESS");
            booking.setPdfGenerated(true);
        } else {
            booking.setPaymentStatus("FAILED");
        }

        Booking saved = bookingRepository.save(booking);
        List<Long> ids = parseIds(saved.getSelectedPlaceIds());
        List<Place> places = placeRepository.findByIdIn(ids);
        return buildSummaryResponse(saved, places);
    }

    // Helper: Build response object
    private BookingSummaryResponse buildSummaryResponse(Booking booking, List<Place> places) {
        BookingSummaryResponse response = new BookingSummaryResponse();
        response.setBookingId(booking.getId());
        response.setDestinationName(booking.getDestination().getName());
        response.setTravelType(booking.getTravelType());
        response.setOriginalCost(booking.getOriginalCost());
        response.setDiscountPercent(booking.getDiscountPercent());
        response.setDiscountAmount(booking.getDiscountAmount());
        response.setTotalCost(booking.getTotalCost());
        response.setTotalDurationHours(booking.getTotalDurationHours());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setBookingDate(
            booking.getBookingDate()
                .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
        );

        List<PlaceDto> placeDtos = places.stream().map(p -> {
            PlaceDto dto = new PlaceDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setDescription(p.getDescription());
            dto.setImageUrl(p.getImageUrl());
            dto.setEstimatedCost(p.getEstimatedCost());
            dto.setVisitDurationHours(p.getVisitDurationHours());
            dto.setCategory(p.getCategory());
            return dto;
        }).collect(Collectors.toList());

        response.setSelectedPlaces(placeDtos);
        return response;
    }

    // Helper: Parse comma-separated IDs
    private List<Long> parseIds(String idsStr) {
        if (idsStr == null || idsStr.isEmpty()) return List.of();
        return List.of(idsStr.split(",")).stream()
                .map(Long::parseLong)
                .collect(Collectors.toList());
    }
}
