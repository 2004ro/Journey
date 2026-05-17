package com.travel.controller;

import com.travel.model.Ticket;
import com.travel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public ResponseEntity<Ticket> bookTicket(@RequestBody Ticket ticket) {
        Ticket booked = bookingService.bookTicket(ticket);
        return ResponseEntity.ok(booked);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Ticket>> getUserBookings(@PathVariable String email) {
        return ResponseEntity.ok(bookingService.getUserBookings(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ticket>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelTicket(@PathVariable Long id) {
        boolean cancelled = bookingService.cancelTicket(id);
        if (cancelled) {
            return ResponseEntity.ok("Ticket Cancelled");
        }
        return ResponseEntity.badRequest().body("Ticket not found");
    }
}
