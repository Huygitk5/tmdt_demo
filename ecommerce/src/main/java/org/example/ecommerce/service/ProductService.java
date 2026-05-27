package org.example.ecommerce.service;

import org.example.ecommerce.dto.request.CreateProductRequest;
import org.example.ecommerce.dto.response.ProductResponse;
import org.example.ecommerce.entity.Category;
import org.example.ecommerce.entity.Product;
import org.example.ecommerce.entity.ProductImage;
import org.example.ecommerce.entity.User;
import org.example.ecommerce.exception.AppException;
import org.example.ecommerce.exception.ErrorCode;
import org.example.ecommerce.repository.CategoryRepository;
import org.example.ecommerce.repository.ProductRepository;
import org.example.ecommerce.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final org.example.ecommerce.repository.ProductImageRepository productImageRepository;
    private final ProductPlatformService productPlatformService;
    private final ModelMapper modelMapper;

    private User getCurrentUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    public List<ProductResponse> getMyProducts() {
        User user = getCurrentUser();
        return productRepository.findByCustomerId(user.getId()).stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (!product.getCustomer().getId().equals(getCurrentUser().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        return modelMapper.map(product, ProductResponse.class);
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        User user = getCurrentUser();
        Category category = categoryRepository.findById(request.getCategory_id())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Product product = Product.builder()
                .customer(user)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .category(category)
                .build();

        if (request.getImages() != null) {
            List<ProductImage> images = request.getImages().stream().map(url -> {
                return ProductImage.builder().imageUrl(url).product(product).isPrimary(false).sortOrder(0).build();
            }).collect(Collectors.toList());
            if (!images.isEmpty()) images.get(0).setIsPrimary(true);
            product.setImages(images);
        }

        Product savedProduct = productRepository.save(product);

        if (request.getPlatforms() != null) {
            for (var pReq : request.getPlatforms()) {
                productPlatformService.submitToPlatform(savedProduct, pReq);
            }
        }

        return modelMapper.map(savedProduct, ProductResponse.class);
    }

    @Transactional
    public ProductResponse updateProduct(Integer id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        
        if (!product.getCustomer().getId().equals(getCurrentUser().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        Category category = categoryRepository.findById(request.getCategory_id())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        return modelMapper.map(savedProduct, ProductResponse.class);
    }

    @Transactional
    public void deleteProductImage(Integer productId, Integer imageId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        
        if (!product.getCustomer().getId().equals(getCurrentUser().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT)); // we could create IMAGE_NOT_FOUND but INVALID_INPUT works

        if (!image.getProduct().getId().equals(productId)) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        productImageRepository.delete(image);
    }

    @Transactional
    public void resubmitProductPlatform(Integer productId, Integer platformId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        
        if (!product.getCustomer().getId().equals(getCurrentUser().getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        productPlatformService.resubmitToPlatform(product, platformId);
    }
}
