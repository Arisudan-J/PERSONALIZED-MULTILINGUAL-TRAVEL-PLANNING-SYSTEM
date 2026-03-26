package com.swadeshi.travel.controller;

import com.swadeshi.travel.dto.*;
import com.swadeshi.travel.entity.User;
import com.swadeshi.travel.service.BookingService;
import com.swadeshi.travel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    // POST /api/bookings/create
    // Creates a booking with selected places
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request,
            Authentication auth) {
        try {
            User user = userService.getUserByEmail(auth.getName());
            BookingSummaryResponse response = bookingService.createBooking(user.getId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/bookings/my
    // Get all bookings for logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<BookingSummaryResponse>> getMyBookings(Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/bookings/payment
    // Demo UPI payment simulation
    @PostMapping("/payment")
    public ResponseEntity<?> processPayment(
            @RequestBody PaymentRequest request) {
        try {
            BookingSummaryResponse response = bookingService.processPayment(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
