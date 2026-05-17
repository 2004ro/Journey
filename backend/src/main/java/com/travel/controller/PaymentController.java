package com.travel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> paymentRequest) {
        // Mock payment processing
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("transactionId", UUID.randomUUID().toString());
        response.put("message", "Payment processed successfully");
        
        return ResponseEntity.ok(response);
    }
}
