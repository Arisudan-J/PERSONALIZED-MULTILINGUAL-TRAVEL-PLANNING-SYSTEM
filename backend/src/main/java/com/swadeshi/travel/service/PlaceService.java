package com.swadeshi.travel.service;

import com.swadeshi.travel.dto.PlaceDto;
import com.swadeshi.travel.entity.Place;
import com.swadeshi.travel.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaceService {

    @Autowired
    private PlaceRepository placeRepository;

    public List<PlaceDto> getPlacesByDestination(Long destinationId) {
        return placeRepository.findByDestinationId(destinationId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Place> getPlacesByIds(List<Long> ids) {
        return placeRepository.findByIdIn(ids);
    }

    private PlaceDto toDto(Place place) {
        PlaceDto dto = new PlaceDto();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setDescription(place.getDescription());
        dto.setImageUrl(place.getImageUrl());
        dto.setEstimatedCost(place.getEstimatedCost());
        dto.setVisitDurationHours(place.getVisitDurationHours());
        dto.setCategory(place.getCategory());
        return dto;
    }
}
