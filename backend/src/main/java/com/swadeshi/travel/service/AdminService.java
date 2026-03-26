package com.swadeshi.travel.service;

import com.swadeshi.travel.dto.AnalyticsResponse;
import com.swadeshi.travel.dto.OfferRequest;
import com.swadeshi.travel.entity.*;
import com.swadeshi.travel.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private DestinationRepository destinationRepository;
    @Autowired private OfferRepository offerRepository;

    // ---- Analytics ----
    public AnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long totalDestinations = destinationRepository.count();
        long totalBookings = bookingRepository.count();
        Double revenue = bookingRepository.getTotalRevenue();
        double totalRevenue = revenue != null ? revenue : 0.0;
        long activeOffers = offerRepository.countByStatus("ACTIVE");

        // Most booked destination
        List<Object[]> destCounts = bookingRepository.getDestinationBookingCounts();
        String mostBooked = destCounts.isEmpty() ? "N/A" : (String) destCounts.get(0)[0];

        // Travel type distribution
        Map<String, Long> travelDist = new LinkedHashMap<>();
        for (Object[] row : bookingRepository.getTravelTypeDistribution()) {
            travelDist.put((String) row[0], (Long) row[1]);
        }

        // Monthly bookings for current year
        Map<String, Long> monthly = new LinkedHashMap<>();
        int year = LocalDate.now().getYear();
        for (Object[] row : bookingRepository.getMonthlyBookingStats(year)) {
            int monthNum = ((Number) row[0]).intValue();
            String monthName = Month.of(monthNum).name().substring(0, 3);
            monthly.put(monthName, (Long) row[1]);
        }

        return new AnalyticsResponse(totalUsers, totalDestinations, totalBookings,
                totalRevenue, activeOffers, mostBooked, travelDist, monthly);
    }

    // ---- User Management ----
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // ---- Offer Management ----
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public Offer createOffer(OfferRequest req) {
        Offer offer = new Offer();
        return saveOffer(offer, req);
    }

    public Offer updateOffer(Long id, OfferRequest req) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        return saveOffer(offer, req);
    }

    private Offer saveOffer(Offer offer, OfferRequest req) {
        offer.setName(req.getName());
        offer.setDiscountPercent(req.getDiscountPercent());
        offer.setExpiryDate(req.getExpiryDate());
        offer.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");
        if (req.getDestinationId() != null) {
            Destination dest = destinationRepository.findById(req.getDestinationId())
                    .orElseThrow(() -> new RuntimeException("Destination not found"));
            offer.setDestination(dest);
        }
        return offerRepository.save(offer);
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }

    // ---- Destination featured toggle ----
    public Destination toggleFeatured(Long destId) {
        Destination dest = destinationRepository.findById(destId)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
        dest.setFeatured(!Boolean.TRUE.equals(dest.getFeatured()));
        return destinationRepository.save(dest);
    }
}
