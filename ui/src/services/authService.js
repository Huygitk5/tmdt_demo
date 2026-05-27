// src/services/authService.js
import axiosInstance from './axiosInstance';

export const authService = {
    login: (credentials) => {
        return axiosInstance.post('/auth/login', credentials);
    },
    register: (data) => {
        return axiosInstance.post('/auth/register', data);
    },
    getMe: () => {
        return axiosInstance.get('/auth/me');
    }
};