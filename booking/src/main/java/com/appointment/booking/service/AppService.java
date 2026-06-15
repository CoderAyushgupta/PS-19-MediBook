package com.appointment.booking.service;

import com.appointment.booking.entity.*;
import com.appointment.booking.repository.*;
import com.appointment.booking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AppService {

    @Autowired private UserRepo userRepo;
    @Autowired private ProviderRepo providerRepo;
    @Autowired private SlotRepo slotRepo;
    @Autowired private AppointmentRepo appointmentRepo;
    @Autowired private JwtUtil jwtUtil;

    public Map<String, String> register(Map<String, String> b) {
        if (userRepo.existsByEmail(b.get("email")))
            return Map.of("status", "error", "message", "Email already registered!");

        User u = new User();
        u.setFullName(b.get("fullName"));
        u.setEmail(b.get("email"));
        u.setPasswordHash(b.get("password"));
        u.setPhone(b.get("phone"));
        u.setRole("patient");

        userRepo.save(u);

        return Map.of(
                "status", "success",
                "message", "Account created!"
        );
    }

    public Map<String, String> login(Map<String, String> b) {

        Optional<User> found = userRepo.findByEmail(b.get("email"));

        if (found.isEmpty())
            return Map.of("status", "error", "message", "Email not found!");

        User u = found.get();

        if (!u.getPasswordHash().equals(b.get("password")))
            return Map.of("status", "error", "message", "Wrong password!");

        String token = jwtUtil.generateToken(u.getEmail(), u.getRole());

        return Map.of(
                "status", "success",
                "token", token,
                "role", u.getRole(),
                "name", u.getFullName(),
                "userId", u.getUserId().toString()
        );
    }

    public List<Provider> getProviders() {
        return providerRepo.findByAvailableTrue();
    }

    public List<TimeSlot> getSlots(Long providerId) {
        return slotRepo.findByProvider_ProviderIdAndBookedFalse(providerId);
    }

    public Map<String, String> book(Map<String, Object> b) {

        Long uid = Long.valueOf(b.get("userId").toString());
        Long sid = Long.valueOf(b.get("slotId").toString());

        TimeSlot slot = slotRepo.findById(sid).orElseThrow();

        if (slot.isBooked())
            return Map.of("status", "error", "message", "Slot already booked!");

        User user = userRepo.findById(uid).orElseThrow();

        Appointment a = new Appointment();
        a.setUser(user);
        a.setProvider(slot.getProvider());
        a.setSlot(slot);
        a.setNotes(b.get("notes") != null ? b.get("notes").toString() : "");
        a.setStatus("confirmed");

        slot.setBooked(true);
        slotRepo.save(slot);

        appointmentRepo.save(a);

        return Map.of(
                "status", "success",
                "message", "Appointment booked!"
        );
    }

    public List<Appointment> myAppointments(Long userId) {
        return appointmentRepo.findByUser_UserId(userId);
    }

    public Map<String, String> cancel(Long id) {

        Appointment a = appointmentRepo.findById(id).orElseThrow();

        a.setStatus("cancelled");

        a.getSlot().setBooked(false);
        slotRepo.save(a.getSlot());

        appointmentRepo.save(a);

        return Map.of(
                "status", "success",
                "message", "Appointment cancelled."
        );
    }

    // DOCTOR APPOINTMENTS
    public List<Appointment> doctorAppointments(Long providerId) {
        return appointmentRepo.findByProvider_ProviderId(providerId);
    }

    // DOCTOR CANCEL APPOINTMENT
    public Map<String, String> doctorCancel(Long appointmentId) {

        Appointment a = appointmentRepo.findById(appointmentId).orElseThrow();

        a.setStatus("cancelled_by_doctor");

        a.getSlot().setBooked(false);
        slotRepo.save(a.getSlot());

        appointmentRepo.save(a);

        return Map.of(
                "status", "success",
                "message", "Appointment cancelled by doctor!"
        );
    }

    public List<User> allUsers() {
        return userRepo.findAll();
    }

    public List<Appointment> allAppointments() {
        return appointmentRepo.findAll();
    }

    public List<Provider> allProviders() {
        return providerRepo.findAll();
    }

    // DELETE USER
    public Map<String, String> deleteUser(Long id) {

        userRepo.deleteById(id);

        return Map.of(
                "status", "success",
                "message", "User deleted!"
        );
    }

    // DELETE DOCTOR
    public Map<String, String> deleteProvider(Long id) {

        providerRepo.deleteById(id);

        return Map.of(
                "status", "success",
                "message", "Doctor deleted!"
        );
    }
}