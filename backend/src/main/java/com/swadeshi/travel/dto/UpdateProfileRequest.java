package com.swadeshi.travel.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String city;
    private String preferredLanguage;
}
