package org.example.ecommerce.repository;

import org.example.ecommerce.entity.ProductPlatform;
import org.example.ecommerce.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPlatformRepository extends JpaRepository<ProductPlatform, Integer> {
    List<ProductPlatform> findByProductId(Integer productId);
    Page<ProductPlatform> findByPlatformIdAndStatus(Integer platformId, ProductStatus status, Pageable pageable);
    Page<ProductPlatform> findByPlatformId(Integer platformId, Pageable pageable);
    Page<ProductPlatform> findByPlatformIdAndStatusIn(Integer platformId, List<ProductStatus> statuses, Pageable pageable);
}
