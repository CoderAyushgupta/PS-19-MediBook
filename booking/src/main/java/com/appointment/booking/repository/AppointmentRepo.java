package com.appointment.booking.repository;

import com.appointment.booking.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {

    // Patient ke appointments
    List<Appointment> findByUser_UserId(Long userId);

    // Doctor ke appointments
    List<Appointment> findByProvider_ProviderId(Long providerId);

}