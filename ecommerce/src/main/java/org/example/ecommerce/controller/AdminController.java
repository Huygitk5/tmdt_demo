package org.example.ecommerce.controller;

import org.example.ecommerce.dto.request.RejectProductRequest;
import org.example.ecommerce.dto.response.ApiResponse;
import org.example.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
