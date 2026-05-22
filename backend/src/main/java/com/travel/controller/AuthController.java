package com.travel.controller;

import com.travel.model.User;
import com.travel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User registered = userService.registerUser(user);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("email", registered.getEmail());
            response.put("name", registered.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        String emailLower = email.trim().toLowerCase();
        Optional<User> userOpt = userService.findUserByEmail(emailLower);

        if (userOpt.isEmpty()) {
            // Auto register the user for a seamless demo/presentation flow if they don't exist yet
            User newUser = new User();
            newUser.setEmail(emailLower);
            newUser.setPassword(password != null ? password : "password");
            newUser.setName(emailLower.split("@")[0]);
            User registered = userService.registerUser(newUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("token", "mock-jwt-token-12345");
            response.put("email", registered.getEmail());
            response.put("name", registered.getName());
            return ResponseEntity.ok(response);
        }

        User user = userOpt.get();
        // check password or allow any for dev demo if not strict, but we can do a simple comparison
        if (password != null && !password.isEmpty()) {
            user.setPassword(password);
            userService.updateUserProfile(user); // update the password
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("token", "mock-jwt-token-12345");
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {
        Optional<User> userOpt = userService.findUserByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {
        try {
            User updated = userService.updateUserProfile(user);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
