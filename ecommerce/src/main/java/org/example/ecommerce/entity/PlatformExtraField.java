package org.example.ecommerce.entity;

import org.example.ecommerce.enums.FieldType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "platform_extra_fields")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformExtraField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "platform_id")
    private Platform platform;

    @Column(name = "field_name", length = 100)
    private String fieldName;

    @Column(name = "field_label")
    private String fieldLabel;

    @Enumerated(EnumType.STRING)
    @Column(name = "field_type")
    private FieldType fieldType;

    @Column(name = "is_required")
    private Boolean isRequired;
}
