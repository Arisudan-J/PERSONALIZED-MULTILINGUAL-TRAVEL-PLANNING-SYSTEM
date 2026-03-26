package com.swadeshi.travel.controller;

import com.swadeshi.travel.entity.Offer;
import com.swadeshi.travel.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    // GET /api/offers/active — public endpoint for dashboard display
    @GetMapping("/active")
    public ResponseEntity<List<Offer>> getActiveOffers() {
        return ResponseEntity.ok(offerRepository.findByStatus("ACTIVE"));
    }
}
