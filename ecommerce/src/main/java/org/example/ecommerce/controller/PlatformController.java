package org.example.ecommerce.controller;

import org.example.ecommerce.dto.response.ApiResponse;
import org.example.ecommerce.dto.response.CategoryResponse;
import org.example.ecommerce.dto.response.PlatformResponse;
import org.example.ecommerce.entity.PlatformExtraField;
import org.example.ecommerce.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.ecommerce.dto.response.PageResponse;
import org.example.ecommerce.dto.response.ProductResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/platforms")
@RequiredArgsConstructor
public class PlatformController {

    private final PlatformService platformService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<PlatformResponse>>> getAllPlatforms() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Platforms retrieved", platformService.getAllPlatforms()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlatformResponse>> getPlatformById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Platform retrieved", platformService.getPlatformById(id)));
    }

    @GetMapping("/{id}/extra-fields")
    public ResponseEntity<ApiResponse<List<PlatformExtraField>>> getExtraFields(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Extra fields retrieved", platformService.getExtraFields(id)));
    }

    @GetMapping("/{id}/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Categories retrieved", platformService.getCategories(id)));
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getPlatformProducts(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved", platformService.getPlatformProducts(id, page, size)));
    }
}
