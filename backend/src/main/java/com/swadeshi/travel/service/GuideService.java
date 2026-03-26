package com.swadeshi.travel.service;

import com.swadeshi.travel.entity.Guide;
import com.swadeshi.travel.repository.GuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GuideService {

    @Autowired
    private GuideRepository guideRepository;

    public List<Guide> getGuidesByDestination(Long destinationId) {
        return guideRepository.findByDestinationId(destinationId);
    }

    public List<Guide> getAllGuides() {
        return guideRepository.findAll();
    }
}
