package com.swadeshi.travel.repository;

import com.swadeshi.travel.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByStatus(String status);

    @Query("SELECT o FROM Offer o WHERE o.destination.id = :destId AND o.status = 'ACTIVE' AND o.expiryDate >= :today ORDER BY o.discountPercent DESC")
    Optional<Offer> findBestActiveOfferForDestination(@Param("destId") Long destId, @Param("today") LocalDate today);

    long countByStatus(String status);
}
