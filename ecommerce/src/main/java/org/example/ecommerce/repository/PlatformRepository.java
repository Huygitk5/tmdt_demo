package org.example.ecommerce.repository;

import org.example.ecommerce.entity.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Integer> {
    Optional<Platform> findBySlug(String slug);
}
