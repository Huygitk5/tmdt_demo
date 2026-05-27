package org.example.ecommerce.service;

import org.example.ecommerce.dto.request.PlatformSubmitRequest;
import org.example.ecommerce.dto.request.RemovePlatformsRequest;
import org.example.ecommerce.entity.*;
import org.example.ecommerce.enums.ProductStatus;
import org.example.ecommerce.exception.AppException;
import org.example.ecommerce.exception.ErrorCode;
import org.example.ecommerce.repository.PlatformExtraFieldRepository;
import org.example.ecommerce.repository.PlatformRepository;
import org.example.ecommerce.repository.ProductExtraValueRepository;
import org.example.ecommerce.repository.ProductPlatformRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductPlatformService {

    private final ProductPlatformRepository productPlatformRepository;
    private final PlatformRepository platformRepository;
    private final PlatformExtraFieldRepository platformExtraFieldRepository;
    private final ProductExtraValueRepository productExtraValueRepository;

    @Transactional
    public void submitToPlatform(Product product, PlatformSubmitRequest request) {
        Platform platform = platformRepository.findById(request.getPlatform_id())
                .orElseThrow(() -> new AppException(ErrorCode.PLATFORM_NOT_FOUND));

        ProductPlatform pp = ProductPlatform.builder()
                .product(product)
                .platform(platform)
                .status(ProductStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        pp = productPlatformRepository.save(pp);

        if (request.getExtra_values() != null) {
            for (var evReq : request.getExtra_values()) {
                PlatformExtraField field = platformExtraFieldRepository.findById(evReq.getField_id())
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));
                
                ProductExtraValue pev = ProductExtraValue.builder()
                        .productPlatform(pp)
                        .field(field)
                        .value(evReq.getValue())
                        .build();
                productExtraValueRepository.save(pev);
            }
        }
    }

    @Transactional
    public void removePlatforms(Integer productId, RemovePlatformsRequest request) {
        // Find ProductPlatform and mark as REMOVED
    }

    @Transactional
    public void resubmitToPlatform(Product product, Integer platformId) {
        ProductPlatform pp = productPlatformRepository.findByProductId(product.getId()).stream()
                .filter(p -> p.getPlatform().getId().equals(platformId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (pp.getStatus() == ProductStatus.APPROVED || pp.getStatus() == ProductStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_INPUT); // Can only resubmit rejected/removed
        }

        pp.setStatus(ProductStatus.PENDING);
        pp.setSubmittedAt(LocalDateTime.now());
        productPlatformRepository.save(pp);
    }
}
