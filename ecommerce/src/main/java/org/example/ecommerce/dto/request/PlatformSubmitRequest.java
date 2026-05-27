package org.example.ecommerce.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class PlatformSubmitRequest {
    private Integer platform_id;
    private List<ExtraValueRequest> extra_values;
}
