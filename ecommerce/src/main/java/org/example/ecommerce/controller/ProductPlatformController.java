package org.example.ecommerce.controller;

import org.example.ecommerce.dto.request.PlatformSubmitRequest;
import org.example.ecommerce.dto.request.RemovePlatformsRequest;
import org.example.ecommerce.dto.response.ApiResponse;
import org.example.ecommerce.entity.Product;
import org.example.ecommerce.exception.AppException;
import org.example.ecommerce.exception.ErrorCode;
import org.example.ecommerce.repository.ProductRepository;
import org.example.ecommerce.service.ProductPlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products/{productId}/platforms")
@RequiredArgsConstructor
public class ProductPlatformController {

    private final ProductPlatformService productPlatformService;
    private final ProductRepository productRepository;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submitToPlatform(@PathVariable Integer productId, @RequestBody PlatformSubmitRequest request) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productPlatformService.submitToPlatform(product, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Submitted to platform", null));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> removePlatforms(@PathVariable Integer productId, @RequestBody RemovePlatformsRequest request) {
        productPlatformService.removePlatforms(productId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Removed from platforms", null));
    }
}
