package com.travel.service;

import com.travel.model.User;
import com.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        String emailLower = user.getEmail().trim().toLowerCase();
        Optional<User> existing = userRepository.findByEmailIgnoreCase(emailLower);
        if (existing.isPresent()) {
            return existing.get(); // Or throw exception, but for seamless travel app, returning existing is safe
        }
        user.setEmail(emailLower);
        user.setCreatedDate(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        String emailLower = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(emailLower);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // simple check: if password matches (for dev/demo we accept any password or exact check)
            if (password != null && password.equals(user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<User> findUserByEmail(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
    }

    public User updateUserProfile(User updatedUser) {
        if (updatedUser.getEmail() == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        String emailLower = updatedUser.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(emailLower)
                .orElseGet(() -> {
                    updatedUser.setEmail(emailLower);
                    updatedUser.setCreatedDate(LocalDateTime.now());
                    return updatedUser;
                });

        // Update fields if provided
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getGender() != null) user.setGender(updatedUser.getGender());
        if (updatedUser.getDob() != null) user.setDob(updatedUser.getDob());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
        if (updatedUser.getPrefTransport() != null) user.setPrefTransport(updatedUser.getPrefTransport());
        if (updatedUser.getPrefSeat() != null) user.setPrefSeat(updatedUser.getPrefSeat());
        if (updatedUser.getPrefMeal() != null) user.setPrefMeal(updatedUser.getPrefMeal());
        if (updatedUser.getTravelClass() != null) user.setTravelClass(updatedUser.getTravelClass());

        return userRepository.save(user);
    }
}
