package org.example.ecommerce.service;

import org.example.ecommerce.dto.request.RejectProductRequest;
import org.example.ecommerce.entity.AdminProfile;
import org.example.ecommerce.entity.ProductPlatform;
import org.example.ecommerce.entity.User;
import org.example.ecommerce.enums.ProductStatus;
import org.example.ecommerce.enums.RemovedByRole;
import org.example.ecommerce.exception.AppException;
import org.example.ecommerce.exception.ErrorCode;
import org.example.ecommerce.repository.AdminProfileRepository;
import org.example.ecommerce.repository.ProductPlatformRepository;
import org.example.ecommerce.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.ecommerce.dto.response.PageResponse;
import org.example.ecommerce.dto.response.ProductResponse;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductPlatformRepository productPlatformRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final ModelMapper modelMapper;

    private User getCurrentAdmin() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    private AdminProfile getAdminProfile() {
        User admin = getCurrentAdmin();
        return adminProfileRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
    }

    @Transactional
    public void approveProduct(Integer productPlatformId) {
        AdminProfile profile = getAdminProfile();
        ProductPlatform pp = productPlatformRepository.findById(productPlatformId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!pp.getPlatform().getId().equals(profile.getPlatform().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        pp.setStatus(ProductStatus.APPROVED);
        pp.setReviewedBy(profile.getUser());
        pp.setReviewedAt(LocalDateTime.now());
        productPlatformRepository.save(pp);
    }

    @Transactional
    public void rejectProduct(Integer productPlatformId, RejectProductRequest request) {
        AdminProfile profile = getAdminProfile();
        ProductPlatform pp = productPlatformRepository.findById(productPlatformId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!pp.getPlatform().getId().equals(profile.getPlatform().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        pp.setStatus(ProductStatus.REJECTED);
        pp.setRejectedReason(request.getReason());
        pp.setReviewedBy(profile.getUser());
        pp.setReviewedAt(LocalDateTime.now());
        productPlatformRepository.save(pp);
    }

    @Transactional
    public void removeProduct(Integer productPlatformId) {
        AdminProfile profile = getAdminProfile();
        ProductPlatform pp = productPlatformRepository.findById(productPlatformId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!pp.getPlatform().getId().equals(profile.getPlatform().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        pp.setStatus(ProductStatus.REMOVED);
        pp.setRemovedByRole(RemovedByRole.ADMIN);
        productPlatformRepository.save(pp);
    }

    public PageResponse<ProductResponse> getProducts(ProductStatus status, int page, int size) {
        AdminProfile profile = getAdminProfile();
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductPlatform> ppPage;

        if (status != null) {
            ppPage = productPlatformRepository.findByPlatformIdAndStatus(profile.getPlatform().getId(), status, pageable);
        } else {
            ppPage = productPlatformRepository.findByPlatformId(profile.getPlatform().getId(), pageable);
        }

        List<ProductResponse> products = ppPage.getContent().stream()
                .map(pp -> modelMapper.map(pp.getProduct(), ProductResponse.class))
                .collect(Collectors.toList());

        return PageResponse.<ProductResponse>builder()
                .content(products)
                .page(ppPage.getNumber())
                .size(ppPage.getSize())
                .total(ppPage.getTotalElements())
                .build();
    }

    public ProductResponse getProductDetail(Integer productPlatformId) {
        AdminProfile profile = getAdminProfile();
        ProductPlatform pp = productPlatformRepository.findById(productPlatformId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!pp.getPlatform().getId().equals(profile.getPlatform().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return modelMapper.map(pp.getProduct(), ProductResponse.class);
    }
}
