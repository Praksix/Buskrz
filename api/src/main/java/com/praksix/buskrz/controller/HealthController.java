package com.praksix.buskrz.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    
    @GetMapping("/health")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> healthCheckRoot() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
    
    
    
    @GetMapping("/test")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
    
    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> healthCheckSimple() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }

   
    
}
