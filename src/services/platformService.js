// src/services/platformService.js
import axiosInstance from './axiosInstance';

export const platformService = {
    getAllPlatforms: () => axiosInstance.get('/platforms/list'),
    getPlatformById: (id) => axiosInstance.get(`/platforms/${id}`),
    getExtraFields: (id) => axiosInstance.get(`/platforms/${id}/extra-fields`),
    getCategoriesByPlatform: (id) => axiosInstance.get(`/platforms/${id}/categories`),
    getPlatformProducts: (id) => axiosInstance.get(`/platforms/${id}/products`),
};

export const categoryService = {
    getCommonCategories: () => axiosInstance.get('/categories/list'),
};