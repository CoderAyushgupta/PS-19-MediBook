package com.appointment.booking.repository;

import com.appointment.booking.entity.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActivityLogRepo extends MongoRepository<ActivityLog, String> {
}