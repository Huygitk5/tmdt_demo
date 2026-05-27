// src/pages/customer/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Table, Typography, Space, message, Popconfirm } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import StatusBadge from '../../components/common/StatusBadge';

const { Title } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await productService.getProductById(id);
            if (res.success) setProduct(res.data);
        } catch (error) {
            message.error('Lỗi tải chi tiết sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePlatform = async (platformId) => {
        try {
            const res = await productService.removePlatform(id, { platform_ids: [platformId] });
            if (res.success) {
                message.success('Đã gỡ sản phẩm khỏi sàn');
                fetchDetail();
            }
        } catch (error) {
            message.error('Lỗi khi gỡ sản phẩm');
        }
    };

    if (!product) return <Card loading={loading} />;

    const platformColumns = [
        { title: 'Tên Sàn', dataIndex: 'platformName', key: 'platformName' },
        { title: 'Trạng thái', key: 'status', render: (_, record) => <StatusBadge status={record.status} /> },
        { title: 'Lý do (nếu từ chối)', dataIndex: 'rejectedReason', key: 'rejectedReason', render: (text) => <span style={{ color: 'red' }}>{text}</span> },
        { title: 'Ngày gửi', dataIndex: 'submittedAt', key: 'submittedAt', render: (val) => val ? new Date(val).toLocaleString() : '-' },
        { 
            title: 'Hành động', 
            key: 'action',
            render: (_, record) => (
                <Popconfirm title="Gỡ sản phẩm khỏi sàn này?" onConfirm={() => handleRemovePlatform(record.platformId)}>
                    <Button danger type="link" disabled={record.status === 'REMOVED'}>Gỡ bỏ</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Title level={4}>Chi Tiết Sản Phẩm: {product.name}</Title>
                <Space>
                    <Button onClick={() => navigate('/customer/products')}>Quay lại</Button>
                    <Button type="primary" onClick={() => navigate(`/customer/products/${id}/edit`)}>Chỉnh sửa</Button>
                </Space>
            </div>

            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Danh mục">{product.category?.name}</Descriptions.Item>
                <Descriptions.Item label="Giá bán">{`${product.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ</Descriptions.Item>
                <Descriptions.Item label="Kho">{product.quantity}</Descriptions.Item>
                <Descriptions.Item label="Hình ảnh">
                    {product.images?.map((img, idx) => <img key={idx} src={img} alt="sp" style={{ width: 50, marginRight: 8 }} />)}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>{product.description}</Descriptions.Item>
            </Descriptions>

            <Title level={5}>Trạng Thái Đăng Sàn</Title>
            <Table 
                columns={platformColumns} 
                dataSource={product.platforms} 
                rowKey="id" 
                pagination={false} 
            />
        </Card>
    );
};

export default ProductDetailPage;