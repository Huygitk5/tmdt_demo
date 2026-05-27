package org.example.ecommerce.controller;

import org.example.ecommerce.dto.response.ApiResponse;
import org.example.ecommerce.dto.response.CategoryResponse;
import org.example.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Categories retrieved", categoryService.getCommonCategories()));
    }
}
