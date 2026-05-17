package com.travel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // A simple mock for presentation purposes
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Map<String, String> response = new HashMap<>();
        if (email != null && !email.isEmpty() && password != null && !password.isEmpty()) {
            response.put("status", "success");
            response.put("token", "mock-jwt-token-12345");
            response.put("email", email);
            return ResponseEntity.ok(response);
        }
        
        response.put("status", "error");
        response.put("message", "Invalid credentials");
        return ResponseEntity.status(401).body(response);
    }
}
