package org.example.ecommerce.dto.request;

import org.example.ecommerce.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private Role role;
    private Integer platform_id; // For admin
}
