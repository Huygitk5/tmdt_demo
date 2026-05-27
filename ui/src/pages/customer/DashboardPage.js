// src/pages/customer/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, message } from 'antd';
import { AppstoreOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { productService } from '../../services/productService';

const DashboardPage = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

    useEffect(() => {
        productService.getMyProducts().then(res => {
            if (res.success) {
                const products = res.data;
                let pending = 0, approved = 0, rejected = 0;
                
                // Đếm status trên các nền tảng
                products.forEach(p => {
                    p.platforms?.forEach(plat => {
                        if (plat.status === 'PENDING') pending++;
                        if (plat.status === 'APPROVED') approved++;
                        if (plat.status === 'REJECTED') rejected++;
                    });
                });

                setStats({ total: products.length, pending, approved, rejected });
            }
        }).catch(() => message.error('Lỗi lấy thống kê'));
    }, []);

    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>Tổng quan sản phẩm</h2>
            <Row gutter={16}>
                <Col span={6}>
                    <Card><Statistic title="Tổng sản phẩm tạo" value={stats.total} prefix={<AppstoreOutlined />} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đang chờ duyệt" value={stats.pending} valueStyle={{ color: '#1890ff' }} prefix={<SyncOutlined spin />} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đã được duyệt" value={stats.approved} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Bị từ chối" value={stats.rejected} valueStyle={{ color: '#cf1322' }} prefix={<CloseCircleOutlined />} /></Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;