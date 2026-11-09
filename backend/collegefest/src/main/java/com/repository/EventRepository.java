package com.collegefest.collegefest.repository;

import com.collegefest.collegefest.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}