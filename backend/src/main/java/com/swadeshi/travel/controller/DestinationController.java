package com.swadeshi.travel.controller;

import com.swadeshi.travel.entity.Destination;
import com.swadeshi.travel.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    // GET /api/destinations
    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    // GET /api/destinations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getDestinationById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(destinationService.getDestinationById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/destinations/featured
    @GetMapping("/featured")
    public ResponseEntity<List<Destination>> getFeaturedDestinations() {
        return ResponseEntity.ok(destinationService.getFeaturedDestinations());
    }

    // GET /api/destinations/search?name=ooty
    @GetMapping("/search")
    public ResponseEntity<List<Destination>> searchDestinations(@RequestParam String name) {
        return ResponseEntity.ok(destinationService.searchDestinations(name));
    }
}
