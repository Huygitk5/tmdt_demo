package org.example.ecommerce.controller;

import org.example.ecommerce.dto.request.CreateProductRequest;
import org.example.ecommerce.dto.response.ApiResponse;
import org.example.ecommerce.dto.response.ProductResponse;
import org.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMyProducts() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved", productService.getMyProducts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved", productService.getProductById(id)));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", productService.createProduct(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Integer id, @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", productService.updateProduct(id, request)));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(@PathVariable Integer id, @PathVariable Integer imageId) {
        productService.deleteProductImage(id, imageId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product image deleted", null));
    }

    @PutMapping("/{id}/platforms/{platformId}")
    public ResponseEntity<ApiResponse<Void>> resubmitProductPlatform(@PathVariable Integer id, @PathVariable Integer platformId) {
        productService.resubmitProductPlatform(id, platformId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product resubmitted to platform", null));
    }
}
