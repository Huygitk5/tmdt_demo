package org.example.ecommerce.service;

import org.example.ecommerce.dto.response.CategoryResponse;
import org.example.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public List<CategoryResponse> getCommonCategories() {
        return categoryRepository.findByPlatformIdIsNull().stream()
                .map(c -> modelMapper.map(c, CategoryResponse.class))
                .collect(Collectors.toList());
    }
}
