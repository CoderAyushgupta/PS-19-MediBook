package com.appointment.booking.repository;

import com.appointment.booking.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProviderRepo extends JpaRepository<Provider, Long> {
    List<Provider> findByAvailableTrue();
}