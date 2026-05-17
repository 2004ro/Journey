package com.travel.service;

import com.travel.model.Ticket;
import com.travel.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket bookTicket(Ticket ticket) {
        ticket.setStatus("BOOKED");
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getUserBookings(String email) {
        return ticketRepository.findByUserEmail(email);
    }

    public List<Ticket> getAllBookings() {
        return ticketRepository.findAll();
    }

    public boolean cancelTicket(Long id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus("CANCELLED");
            ticketRepository.save(ticket);
            return true;
        }
        return false;
    }
}
