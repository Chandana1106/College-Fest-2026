package com.collegefest.collegefest.controller;

import com.collegefest.collegefest.entity.Registration;
import com.collegefest.collegefest.repository.RegistrationRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    private final RegistrationRepository registrationRepository;

    public RegistrationController(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @GetMapping
    public List<Registration> getRegistrations() {
        return registrationRepository.findAll();
    }

    @PostMapping
    public Registration addRegistration(@RequestBody Registration registration) {
        return registrationRepository.save(registration);
    }

    @DeleteMapping("/{id}")
    public void deleteRegistration(@PathVariable Long id) {
        registrationRepository.deleteById(id);
    }
}