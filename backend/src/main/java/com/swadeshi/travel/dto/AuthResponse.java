package com.swadeshi.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Long userId;
    private String preferredLanguage;
    private String role;
}
