package com.appointment.booking.repository;

import com.appointment.booking.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SlotRepo extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByProvider_ProviderIdAndBookedFalse(Long providerId);
    List<TimeSlot> findByProvider_ProviderId(Long providerId);
}