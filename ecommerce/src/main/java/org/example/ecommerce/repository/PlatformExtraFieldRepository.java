package org.example.ecommerce.repository;

import org.example.ecommerce.entity.PlatformExtraField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatformExtraFieldRepository extends JpaRepository<PlatformExtraField, Integer> {
    List<PlatformExtraField> findByPlatformId(Integer platformId);
}
