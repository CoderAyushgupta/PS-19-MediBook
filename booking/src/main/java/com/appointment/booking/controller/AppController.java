package com.appointment.booking.controller;

import com.appointment.booking.entity.*;
import com.appointment.booking.service.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AppController {

    @Autowired
    private AppService appService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> b) {
        return appService.register(b);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> b) {
        return appService.login(b);
    }

    @GetMapping("/providers")
    public List<Provider> getProviders() {
        return appService.getProviders();
    }

    @GetMapping("/slots/{providerId}")
    public List<TimeSlot> getSlots(@PathVariable Long providerId) {
        return appService.getSlots(providerId);
    }

    @PostMapping("/book")
    public org.springframework.http.ResponseEntity<?> book(
            @RequestBody Map<String, Object> b) {

        try {
            Map<String, String> result = appService.book(b);
            return org.springframework.http.ResponseEntity.ok(result);

        } catch (Exception e) {

            return org.springframework.http.ResponseEntity.ok(
                    Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // PATIENT APPOINTMENTS

    @GetMapping("/my-appointments/{userId}")
    public List<Appointment> myAppointments(@PathVariable Long userId) {
        return appService.myAppointments(userId);
    }

    @DeleteMapping("/cancel/{id}")
    public Map<String, String> cancel(@PathVariable Long id) {
        return appService.cancel(id);
    }

    // ==========================
    // DOCTOR APIs
    // ==========================

    @GetMapping("/doctor/appointments/{providerId}")
    public List<Appointment> doctorAppointments(@PathVariable Long providerId) {
        return appService.doctorAppointments(providerId);
    }

    @PutMapping("/doctor/cancel/{id}")
    public Map<String, String> doctorCancel(@PathVariable Long id) {
        return appService.doctorCancel(id);
    }

    // ==========================
    // ADMIN APIs
    // ==========================

    @GetMapping("/admin/users")
    public List<User> allUsers() {
        return appService.allUsers();
    }

    @GetMapping("/admin/appointments")
    public List<Appointment> allAppointments() {
        return appService.allAppointments();
    }

    @GetMapping("/admin/providers")
    public List<Provider> allProviders() {
        return appService.allProviders();
    }

    @DeleteMapping("/admin/user/{id}")
    public Map<String, String> deleteUser(@PathVariable Long id) {
        return appService.deleteUser(id);
    }

    @DeleteMapping("/admin/provider/{id}")
    public Map<String, String> deleteProvider(@PathVariable Long id) {
        return appService.deleteProvider(id);
    }
}