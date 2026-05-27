// src/services/adminService.js
import axiosInstance from './axiosInstance';

export const adminService = {
    // API lấy danh sách sản phẩm theo status (PENDING, APPROVED...)
    getProducts: (params) => axiosInstance.get('/admin/products', { params }),
    
    // API Duyệt
    approveProduct: (id) => axiosInstance.put(`/admin/products/${id}/approve`),
    
    // API Từ chối (kèm lý do)
    rejectProduct: (id, payload) => axiosInstance.put(`/admin/products/${id}/reject`, payload),
    
    // API Gỡ sản phẩm
    removeProduct: (id) => axiosInstance.delete(`/admin/products/delete/${id}`),
};