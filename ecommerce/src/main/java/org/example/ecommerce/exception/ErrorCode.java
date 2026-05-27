package org.example.ecommerce.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("User not found"),
    USER_EXISTS("User already exists"),
    PLATFORM_NOT_FOUND("Platform not found"),
    PRODUCT_NOT_FOUND("Product not found"),
    CATEGORY_NOT_FOUND("Category not found"),
    UNAUTHORIZED("Unauthorized"),
    FORBIDDEN("Forbidden"),
    INVALID_INPUT("Invalid input data"),
    INTERNAL_SERVER_ERROR("Internal server error");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}
