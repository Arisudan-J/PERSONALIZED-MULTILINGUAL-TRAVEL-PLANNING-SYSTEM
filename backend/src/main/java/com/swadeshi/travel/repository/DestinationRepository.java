package com.swadeshi.travel.repository;

import com.swadeshi.travel.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByNameContainingIgnoreCase(String name);
    List<Destination> findByCategory(String category);
    List<Destination> findByFeaturedTrue();
}
