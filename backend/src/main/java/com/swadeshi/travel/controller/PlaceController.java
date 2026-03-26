package com.swadeshi.travel.controller;

import com.swadeshi.travel.dto.PlaceDto;
import com.swadeshi.travel.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    // GET /api/places/destination/{destinationId}
    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<PlaceDto>> getPlacesByDestination(
            @PathVariable Long destinationId) {
        return ResponseEntity.ok(placeService.getPlacesByDestination(destinationId));
    }
}
