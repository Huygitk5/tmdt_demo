// src/pages/admin/AdminApprovedProducts.js
import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, Space, Popconfirm, message } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { adminService } from '../../services/adminService';

const { Title } = Typography;

const AdminApprovedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchApprovedProducts();
    }, []);

    const fetchApprovedProducts = async () => {
        setLoading(true);
        try {
            // Lấy danh sách sản phẩm có trạng thái APPROVED
            const res = await adminService.getProducts({ status: 'APPROVED' });
            if (res.success) {
                setProducts(res.data.content || res.data || []);
            }
        } catch (error) {
            message.error('Lỗi tải danh sách sản phẩm đang bán');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            const res = await adminService.removeProduct(id);
            if (res.success) {
                message.success('Đã gỡ sản phẩm khỏi sàn thành công!');
                fetchApprovedProducts(); // Load lại bảng
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi khi gỡ sản phẩm');
        }
    };

    const columns = [
        {
            title: 'ID Duyệt',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: ['product', 'name'],
            key: 'productName',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Giá bán',
            dataIndex: ['product', 'price'],
            key: 'price',
            render: (price) => `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'
        },
        {
            title: 'Ngày duyệt',
            dataIndex: 'reviewedAt',
            key: 'reviewedAt',
            render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '-'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Popconfirm 
                    title="Gỡ sản phẩm vi phạm?" 
                    description="Sản phẩm này sẽ bị xóa khỏi sàn của bạn."
                    onConfirm={() => handleRemove(record.id)}
                    okText="Đồng ý Gỡ"
                    cancelText="Hủy"
                >
                    <Button danger icon={<StopOutlined />}>
                        Gỡ khỏi sàn
                    </Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <Card>
            <Title level={4}>Sản Phẩm Đang Hoạt Động (APPROVED)</Title>
            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default AdminApprovedProducts;