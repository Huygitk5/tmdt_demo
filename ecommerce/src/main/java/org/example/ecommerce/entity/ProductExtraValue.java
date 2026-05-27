package org.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_extra_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductExtraValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_platform_id")
    private ProductPlatform productPlatform;

    @ManyToOne
    @JoinColumn(name = "field_id")
    private PlatformExtraField field;

    @Column(length = 500)
    private String value;
}
