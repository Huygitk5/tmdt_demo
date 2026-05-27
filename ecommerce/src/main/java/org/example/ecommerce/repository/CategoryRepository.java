package org.example.ecommerce.repository;

import org.example.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByPlatformIdIsNull();
    List<Category> findByPlatformId(Integer platformId);
}
