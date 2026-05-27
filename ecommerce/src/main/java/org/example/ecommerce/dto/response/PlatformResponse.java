package org.example.ecommerce.dto.response;

import lombok.Data;

@Data
public class PlatformResponse {
    private Integer id;
    private String name;
    private String slug;
    private String logoUrl;
    private String themeColor;
}
