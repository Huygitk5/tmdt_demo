package org.example.ecommerce.service;

import org.example.ecommerce.dto.request.LoginRequest;
import org.example.ecommerce.dto.request.RegisterRequest;
import org.example.ecommerce.dto.response.AuthResponse;
import org.example.ecommerce.dto.response.UserResponse;
import org.example.ecommerce.entity.AdminProfile;
import org.example.ecommerce.entity.Platform;
import org.example.ecommerce.entity.User;
import org.example.ecommerce.enums.Role;
import org.example.ecommerce.exception.AppException;
import org.example.ecommerce.exception.ErrorCode;
import org.example.ecommerce.repository.AdminProfileRepository;
import org.example.ecommerce.repository.PlatformRepository;
import org.example.ecommerce.repository.UserRepository;
import org.example.ecommerce.security.CustomUserDetails;
import org.example.ecommerce.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final PlatformRepository platformRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                .build();

        user = userRepository.save(user);

        if (user.getRole() == Role.ADMIN) {
            if (request.getPlatform_id() == null) {
                throw new AppException(ErrorCode.INVALID_INPUT);
            }
            Platform platform = platformRepository.findById(request.getPlatform_id())
                    .orElseThrow(() -> new AppException(ErrorCode.PLATFORM_NOT_FOUND));

            if (adminProfileRepository.findByPlatformId(platform.getId()).isPresent()) {
                throw new AppException(ErrorCode.INVALID_INPUT); // Platform already has an admin
            }

            AdminProfile adminProfile = AdminProfile.builder()
                    .user(user)
                    .platform(platform)
                    .build();
            adminProfileRepository.save(adminProfile);
        }

        return getAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return getAuthResponse(user);
    }

    public UserResponse getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return modelMapper.map(userDetails.getUser(), UserResponse.class);
    }

    private AuthResponse getAuthResponse(User user) {
        String token = jwtUtil.generateToken(new CustomUserDetails(user));
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        return new AuthResponse(token, userResponse);
    }
}
