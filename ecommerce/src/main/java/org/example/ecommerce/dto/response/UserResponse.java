package org.example.ecommerce.dto.response;

import org.example.ecommerce.enums.Role;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;
}
