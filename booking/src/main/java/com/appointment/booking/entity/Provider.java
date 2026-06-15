package com.appointment.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    private Long providerId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String specialization;
    private String location;

    @Column(nullable = false)
    private Boolean available = true;
}