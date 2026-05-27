package org.example.ecommerce.controller;

import org.example.ecommerce.dto.request.RejectProductRequest;
import org.example.ecommerce.dto.response.ApiResponse;
import org.example.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.ecommerce.dto.response.PageResponse;
import org.example.ecommerce.dto.response.ProductResponse;
import org.example.ecommerce.enums.ProductStatus;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveProduct(@PathVariable Integer id) {
        adminService.approveProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product approved", null));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectProduct(@PathVariable Integer id, @RequestBody RejectProductRequest request) {
        adminService.rejectProduct(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product rejected", null));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> removeProduct(@PathVariable Integer id) {
        adminService.removeProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product removed from platform", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProducts(
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved", adminService.getProducts(status, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product detail retrieved", adminService.getProductDetail(id)));
    }

    @GetMapping("/pending-and-approved")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getPendingAndApprovedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<ProductResponse> responseData = adminService.getPendingAndApprovedProducts(page, size);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Retrieved pending and approved products successfully",
                responseData
        ));
    }
}
