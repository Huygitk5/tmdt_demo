package org.example.ecommerce.entity;

import org.example.ecommerce.enums.ProductStatus;
import org.example.ecommerce.enums.RemovedByRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "product_platforms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPlatform {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "platform_id")
    private Platform platform;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Column(name = "rejected_reason", columnDefinition = "TEXT")
    private String rejectedReason;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "removed_by_role")
    private RemovedByRole removedByRole;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "productPlatform", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductExtraValue> extraValues;
}
