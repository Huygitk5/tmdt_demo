package org.example.ecommerce.dto.response;

import org.example.ecommerce.enums.ProductStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductPlatformResponse {
    private Integer id;
    private Integer platformId;
    private String platformName;
    private ProductStatus status;
    private String rejectedReason;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
}
