import axiosInstance from './axiosInstance';

export const productService = {
    getMyProducts: () => axiosInstance.get('/products/list'),
    getProductById: (id) => axiosInstance.get(`/products/${id}`),
    createProduct: (data) => axiosInstance.post('/products/create', data),
};