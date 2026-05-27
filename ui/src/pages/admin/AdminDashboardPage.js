// src/pages/admin/AdminDashboardPage.js
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, message } from 'antd';
import { SafetyCertificateOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { adminService } from '../../services/adminService';

const AdminDashboardPage = () => {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Đếm số lượng cần duyệt
        adminService.getProducts({ status: 'PENDING' }).then(res => {
            if (res.success) setPendingCount(res.data.total || res.data.content?.length || 0);
        }).catch(() => message.error('Lỗi lấy thống kê admin'));
    }, []);

    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>Thống kê Sàn của bạn</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic 
                            title="Sản phẩm chờ duyệt (Cần xử lý)" 
                            value={pendingCount} 
                            valueStyle={{ color: '#faad14' }} 
                            prefix={<SafetyCertificateOutlined />} 
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card><Statistic title="Sản phẩm đang bán (Approved)" value={"Đang cập nhật..."} prefix={<CheckCircleOutlined />} /></Card>
                </Col>
                <Col span={8}>
                    <Card><Statistic title="Sản phẩm đã gỡ (Removed)" value={"Đang cập nhật..."} prefix={<StopOutlined />} /></Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboardPage;