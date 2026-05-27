// src/pages/customer/ProductListPage.js
import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, Space, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import StatusBadge from '../../components/common/StatusBadge';

const { Title } = Typography;

const ProductListPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productService.getMyProducts();
            if (res.success) {
                setProducts(res.data);
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/customer/products/${record.id}`}><b>{text}</b></Link>
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'name'],
            key: 'category',
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'
        },
        {
            title: 'Kho',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Trạng thái trên các sàn',
            key: 'platforms',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.platforms?.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                            <span style={{ fontWeight: 500 }}>{p.platformName}:</span>
                            <StatusBadge status={p.status} />
                            {p.status === 'REJECTED' && (
                                <Tooltip title={p.rejectedReason}>
                                    <span style={{ cursor: 'pointer', color: 'red' }}>(?)</span>
                                </Tooltip>
                            )}
                        </div>
                    ))}
                    {(!record.platforms || record.platforms.length === 0) && <span style={{ color: '#999' }}>Chưa đăng sàn nào</span>}
                </Space>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/customer/products/${record.id}/edit`)} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4}>Sản Phẩm Của Tôi</Title>
            </div>
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

export default ProductListPage;