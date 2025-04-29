package org.zenith.pay.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.zenith.pay.demo.model.User;

@Data
@AllArgsConstructor
public class AuthResponse {
    private User user;
    private String token;
} 