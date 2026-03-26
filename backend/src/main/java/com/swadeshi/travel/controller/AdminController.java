package com.swadeshi.travel.controller;

import com.swadeshi.travel.dto.AnalyticsResponse;
import com.swadeshi.travel.dto.OfferRequest;
import com.swadeshi.travel.entity.*;
import com.swadeshi.travel.repository.BookingRepository;
import com.swadeshi.travel.repository.DestinationRepository;
import com.swadeshi.travel.repository.GuideRepository;
import com.swadeshi.travel.repository.PlaceRepository;
import com.swadeshi.travel.service.AdminService;
import com.swadeshi.travel.service.DestinationService;
import com.swadeshi.travel.service.GuideService;
import com.swadeshi.travel.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private DestinationRepository destinationRepository;
    @Autowired private PlaceRepository placeRepository;
    @Autowired private GuideRepository guideRepository;
    @Autowired private DestinationService destinationService;
    @Autowired private PlaceService placeService;
    @Autowired private GuideService guideService;

    // ---- Analytics ----
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    // ---- User Management ----
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserActive(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // ---- Destination Management ----
    @PostMapping("/destinations")
    public ResponseEntity<Destination> addDestination(@RequestBody Destination destination) {
        return ResponseEntity.ok(destinationRepository.save(destination));
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<Destination> updateDestination(@PathVariable Long id,
                                                          @RequestBody Destination updated) {
        Destination dest = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
        dest.setName(updated.getName());
        dest.setState(updated.getState());
        dest.setDescription(updated.getDescription());
        dest.setImageUrl(updated.getImageUrl());
        dest.setCategory(updated.getCategory());
        dest.setBaseCost(updated.getBaseCost());
        return ResponseEntity.ok(destinationRepository.save(dest));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable Long id) {
        destinationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Destination deleted"));
    }

    @PutMapping("/destinations/{id}/toggle-featured")
    public ResponseEntity<Destination> toggleFeatured(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleFeatured(id));
    }

    // ---- Place Management ----
    @PostMapping("/places")
    public ResponseEntity<Place> addPlace(@RequestBody Place place) {
        return ResponseEntity.ok(placeRepository.save(place));
    }

    @PutMapping("/places/{id}")
    public ResponseEntity<Place> updatePlace(@PathVariable Long id, @RequestBody Place updated) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Place not found"));
        place.setName(updated.getName());
        place.setDescription(updated.getDescription());
        place.setImageUrl(updated.getImageUrl());
        place.setEstimatedCost(updated.getEstimatedCost());
        place.setVisitDurationHours(updated.getVisitDurationHours());
        place.setCategory(updated.getCategory());
        place.setDestination(updated.getDestination());
        return ResponseEntity.ok(placeRepository.save(place));
    }

    @DeleteMapping("/places/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable Long id) {
        placeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Place deleted"));
    }

    // ---- Guide Management ----
    @PostMapping("/guides")
    public ResponseEntity<Guide> addGuide(@RequestBody Guide guide) {
        return ResponseEntity.ok(guideRepository.save(guide));
    }

    @PutMapping("/guides/{id}")
    public ResponseEntity<Guide> updateGuide(@PathVariable Long id, @RequestBody Guide updated) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guide not found"));
        guide.setName(updated.getName());
        guide.setLanguages(updated.getLanguages());
        guide.setContact(updated.getContact());
        guide.setExperience(updated.getExperience());
        guide.setPerDayCharge(updated.getPerDayCharge());
        guide.setImageUrl(updated.getImageUrl());
        guide.setDestination(updated.getDestination());
        return ResponseEntity.ok(guideRepository.save(guide));
    }

    @DeleteMapping("/guides/{id}")
    public ResponseEntity<?> deleteGuide(@PathVariable Long id) {
        guideRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Guide deleted"));
    }

    // ---- Offer Management ----
    @GetMapping("/offers")
    public ResponseEntity<List<Offer>> getAllOffers() {
        return ResponseEntity.ok(adminService.getAllOffers());
    }

    @PostMapping("/offers")
    public ResponseEntity<Offer> createOffer(@RequestBody OfferRequest req) {
        return ResponseEntity.ok(adminService.createOffer(req));
    }

    @PutMapping("/offers/{id}")
    public ResponseEntity<Offer> updateOffer(@PathVariable Long id, @RequestBody OfferRequest req) {
        return ResponseEntity.ok(adminService.updateOffer(id, req));
    }

    @DeleteMapping("/offers/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        adminService.deleteOffer(id);
        return ResponseEntity.ok(Map.of("message", "Offer deleted"));
    }

    // ---- Booking Management ----
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from != null && to != null) {
            return ResponseEntity.ok(bookingRepository.findByBookingDateBetweenOrderByBookingDateDesc(
                    from.atStartOfDay(), to.plusDays(1).atStartOfDay()));
        }
        return ResponseEntity.ok(bookingRepository.findAllByOrderByBookingDateDesc());
    }
}
