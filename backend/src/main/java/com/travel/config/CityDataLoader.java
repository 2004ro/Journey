package com.travel.config;

import com.travel.model.City;
import com.travel.repository.CityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CityDataLoader {

    @Bean
    CommandLineRunner initCities(CityRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new City("New Delhi", "Delhi", 28.6139, 77.2090));
                repo.save(new City("Mumbai", "Maharashtra", 19.0760, 72.8777));
                repo.save(new City("Bengaluru", "Karnataka", 12.9716, 77.5946));
                repo.save(new City("Chennai", "Tamil Nadu", 13.0827, 80.2707));
                repo.save(new City("Kolkata", "West Bengal", 22.5726, 88.3639));
                repo.save(new City("Hyderabad", "Telangana", 17.3850, 78.4867));
                repo.save(new City("Pune", "Maharashtra", 18.5204, 73.8567));
                repo.save(new City("Ahmedabad", "Gujarat", 23.0225, 72.5714));
                repo.save(new City("Jaipur", "Rajasthan", 26.9124, 75.7873));
                repo.save(new City("Lucknow", "Uttar Pradesh", 26.8467, 80.9462));
                repo.save(new City("Bhopal", "Madhya Pradesh", 23.2599, 77.4126));
                repo.save(new City("Surat", "Gujarat", 21.1702, 72.8311));
                repo.save(new City("Vadodara", "Gujarat", 22.3072, 73.1812));
                repo.save(new City("Nagpur", "Maharashtra", 21.1458, 79.0882));
                repo.save(new City("Indore", "Madhya Pradesh", 22.7196, 75.8577));
                repo.save(new City("Kochi", "Kerala", 9.9312, 76.2673));
            }
        };
    }
}
