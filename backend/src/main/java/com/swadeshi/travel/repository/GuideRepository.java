package com.swadeshi.travel.repository;

import com.swadeshi.travel.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuideRepository extends JpaRepository<Guide, Long> {
    List<Guide> findByDestinationId(Long destinationId);
}
