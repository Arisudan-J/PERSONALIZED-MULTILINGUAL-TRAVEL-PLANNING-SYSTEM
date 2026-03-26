package com.swadeshi.travel.service;

import com.swadeshi.travel.dto.*;
import com.swadeshi.travel.entity.User;
import com.swadeshi.travel.repository.UserRepository;
import com.swadeshi.travel.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setPreferredLanguage(
            request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "en"
        );
        user.setRole("USER");
        user.setActive(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getName(), user.getEmail(),
                user.getId(), user.getPreferredLanguage(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email!"));

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("Your account has been deactivated. Please contact admin.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password!");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getName(), user.getEmail(),
                user.getId(), user.getPreferredLanguage(), user.getRole());
    }
}
