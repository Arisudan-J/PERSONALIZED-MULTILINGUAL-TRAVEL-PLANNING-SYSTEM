package com.swadeshi.travel.service;

import com.swadeshi.travel.dto.UpdateProfileRequest;
import com.swadeshi.travel.entity.User;
import com.swadeshi.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserById(userId);
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getPreferredLanguage() != null)
            user.setPreferredLanguage(request.getPreferredLanguage());
        return userRepository.save(user);
    }
}
