package org.example.ecommerce.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponse {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private CategoryResponse category;
    private List<String> images;
    private List<ProductPlatformResponse> platforms;
}
