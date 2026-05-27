package org.example.ecommerce.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer category_id;
    private List<String> images;
    private List<PlatformSubmitRequest> platforms;
}
