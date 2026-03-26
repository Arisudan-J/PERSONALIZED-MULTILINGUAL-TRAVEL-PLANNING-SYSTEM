package com.swadeshi.travel.repository;

import com.swadeshi.travel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);

    List<Booking> findAllByOrderByBookingDateDesc();

    @Query("SELECT COALESCE(SUM(b.totalCost), 0) FROM Booking b WHERE b.paymentStatus = 'SUCCESS'")
    Double getTotalRevenue();

    @Query("SELECT b.destination.name, COUNT(b) FROM Booking b GROUP BY b.destination.name ORDER BY COUNT(b) DESC")
    List<Object[]> getDestinationBookingCounts();

    @Query("SELECT b.travelType, COUNT(b) FROM Booking b GROUP BY b.travelType")
    List<Object[]> getTravelTypeDistribution();

    @Query("SELECT MONTH(b.bookingDate), COUNT(b) FROM Booking b WHERE YEAR(b.bookingDate) = :year GROUP BY MONTH(b.bookingDate) ORDER BY MONTH(b.bookingDate)")
    List<Object[]> getMonthlyBookingStats(@Param("year") int year);

    List<Booking> findByBookingDateBetweenOrderByBookingDateDesc(LocalDateTime from, LocalDateTime to);
}
