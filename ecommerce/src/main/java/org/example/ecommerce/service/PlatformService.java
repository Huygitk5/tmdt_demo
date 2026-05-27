package org.example.ecommerce.service;

import org.example.ecommerce.dto.response.CategoryResponse;
import org.example.ecommerce.dto.response.PlatformResponse;
import org.example.ecommerce.entity.Category;
import org.example.ecommerce.entity.Platform;
import org.example.ecommerce.entity.PlatformExtraField;
import org.example.ecommerce.exception.AppException;
import org.example.ecommerce.exception.ErrorCode;
import org.example.ecommerce.repository.CategoryRepository;
import org.example.ecommerce.repository.PlatformExtraFieldRepository;
import org.example.ecommerce.repository.PlatformRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.example.ecommerce.dto.response.PageResponse;
import org.example.ecommerce.dto.response.ProductResponse;
import org.example.ecommerce.entity.ProductPlatform;
import org.example.ecommerce.enums.ProductStatus;
import org.example.ecommerce.repository.ProductPlatformRepository;

@Service
@RequiredArgsConstructor
public class PlatformService {

    private final PlatformRepository platformRepository;
    private final PlatformExtraFieldRepository extraFieldRepository;
    private final CategoryRepository categoryRepository;
    private final ProductPlatformRepository productPlatformRepository;
    private final ModelMapper modelMapper;

    public List<PlatformResponse> getAllPlatforms() {
        return platformRepository.findAll().stream()
                .map(p -> modelMapper.map(p, PlatformResponse.class))
                .collect(Collectors.toList());
    }

    public PlatformResponse getPlatformById(Integer id) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PLATFORM_NOT_FOUND));
        return modelMapper.map(platform, PlatformResponse.class);
    }

    public List<PlatformExtraField> getExtraFields(Integer platformId) {
        return extraFieldRepository.findByPlatformId(platformId);
    }

    public List<CategoryResponse> getCategories(Integer platformId) {
        List<Category> categories = categoryRepository.findByPlatformIdIsNull();
        categories.addAll(categoryRepository.findByPlatformId(platformId));
        return categories.stream()
                .map(c -> modelMapper.map(c, CategoryResponse.class))
                .collect(Collectors.toList());
    }

    public PageResponse<ProductResponse> getPlatformProducts(Integer platformId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductPlatform> ppPage = productPlatformRepository.findByPlatformIdAndStatus(platformId, ProductStatus.APPROVED, pageable);
        
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
}
