package com.swadeshi.travel.controller;

import com.swadeshi.travel.entity.Guide;
import com.swadeshi.travel.service.GuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

    @Autowired
    private GuideService guideService;

    // GET /api/guides
    @GetMapping
    public ResponseEntity<List<Guide>> getAllGuides() {
        return ResponseEntity.ok(guideService.getAllGuides());
    }

    // GET /api/guides/destination/{destinationId}
    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<Guide>> getGuidesByDestination(@PathVariable Long destinationId) {
        return ResponseEntity.ok(guideService.getGuidesByDestination(destinationId));
    }
}
