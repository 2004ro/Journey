package com.travel.controller;

import com.travel.model.City;
import com.travel.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    @Autowired
    private CityRepository cityRepository;

    @GetMapping
    public List<City> getAll() {
        return cityRepository.findAll();
    }

    @PostMapping("/price")
    public ResponseEntity<Map<String, Object>> priceForRoute(@RequestBody Map<String, String> body) {
        try {
            Long srcId = Long.parseLong(body.get("sourceId"));
            Long dstId = Long.parseLong(body.get("destinationId"));
            String type = body.get("type");

            Optional<City> sOpt = cityRepository.findById(srcId);
            Optional<City> dOpt = cityRepository.findById(dstId);
            if (sOpt.isEmpty() || dOpt.isEmpty()) return ResponseEntity.badRequest().build();

            City s = sOpt.get();
            City d = dOpt.get();
            double distance = haversine(s.getLatitude(), s.getLongitude(), d.getLatitude(), d.getLongitude());
            double rate = getRateForType(type);
            double price = Math.round(distance * rate * 100.0) / 100.0;

            Map<String, Object> res = new HashMap<>();
            res.put("distanceKm", Math.round(distance*100.0)/100.0);
            res.put("price", price);
            res.put("currency", "INR");
            return ResponseEntity.ok(res);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    private double getRateForType(String type) {
        if (type == null) return 1.0;
        switch (type.toUpperCase()) {
            case "BUS": return 0.6; // INR per km
            case "TRAIN": return 1.2;
            case "FLIGHT": return 3.0;
            default: return 1.0;
        }
    }

    // Haversine formula
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
