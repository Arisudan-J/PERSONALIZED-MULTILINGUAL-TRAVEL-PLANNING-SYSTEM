package com.swadeshi.travel.controller;

import com.swadeshi.travel.dto.UpdateProfileRequest;
import com.swadeshi.travel.entity.User;
import com.swadeshi.travel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/users/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "phone", user.getPhone() != null ? user.getPhone() : "",
            "city", user.getCity() != null ? user.getCity() : "",
            "preferredLanguage", user.getPreferredLanguage()
        ));
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        try {
            User user = userService.getUserByEmail(auth.getName());
            User updated = userService.updateProfile(user.getId(), request);
            return ResponseEntity.ok(Map.of("message", "Profile updated", "name", updated.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
