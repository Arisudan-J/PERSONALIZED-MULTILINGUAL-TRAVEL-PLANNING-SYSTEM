package com.swadeshi.travel.service;

import com.swadeshi.travel.entity.Destination;
import com.swadeshi.travel.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationById(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found!"));
    }

    public List<Destination> searchDestinations(String name) {
        return destinationRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Destination> getFeaturedDestinations() {
        return destinationRepository.findByFeaturedTrue();
    }
}
