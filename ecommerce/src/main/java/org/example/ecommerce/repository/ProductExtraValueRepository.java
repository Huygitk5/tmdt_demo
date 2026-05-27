package org.example.ecommerce.repository;

import org.example.ecommerce.entity.ProductExtraValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductExtraValueRepository extends JpaRepository<ProductExtraValue, Integer> {
    List<ProductExtraValue> findByProductPlatformId(Integer productPlatformId);
}
