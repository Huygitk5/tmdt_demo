package org.example.ecommerce.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class RemovePlatformsRequest {
    private List<Integer> platform_ids;
}
