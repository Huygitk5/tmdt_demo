// src/pages/admin/AdminPendingProducts.js
import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, Space, Modal, Form, Input, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { adminService } from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;

const AdminPendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Modal Reject
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        setLoading(true);
        try {
            // Gọi API lấy danh sách đang chờ duyệt (truyền param status=PENDING)
            const res = await adminService.getProducts({ status: 'PENDING' });
            if (res.success) {
                // Tùy theo cấu trúc trả về của PageResponse (backend)
                setProducts(res.data.content || res.data || []);
            }
        } catch (error) {
            message.error('Lỗi tải danh sách sản phẩm chờ duyệt');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý Duyệt
    const handleApprove = async (id) => {
        try {
            const res = await adminService.approveProduct(id);
            if (res.success) {
                message.success('Đã duyệt sản phẩm thành công!');
                fetchPendingProducts(); // Load lại danh sách
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi khi duyệt sản phẩm');
        }
    };

    // Mở Modal Từ chối
    const openRejectModal = (id) => {
        setSelectedProductId(id);
        setIsRejectModalOpen(true);
    };

    // Submit form Từ chối
    const handleRejectSubmit = async (values) => {
        try {
            const res = await adminService.rejectProduct(selectedProductId, { reason: values.reason });
            if (res.success) {
                message.success('Đã từ chối sản phẩm!');
                setIsRejectModalOpen(false);
                form.resetFields();
                fetchPendingProducts(); // Load lại danh sách
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi khi từ chối sản phẩm');
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
            title: 'Ngày gửi',
            dataIndex: 'submittedAt',
            key: 'submittedAt',
            render: (date) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        icon={<CheckCircleOutlined />} 
                        onClick={() => handleApprove(record.id)}
                    >
                        Duyệt
                    </Button>
                    <Button 
                        type="primary" 
                        danger 
                        icon={<CloseCircleOutlined />} 
                        onClick={() => openRejectModal(record.id)}
                    >
                        Từ chối
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Card>
            <Title level={4}>Sản Phẩm Chờ Duyệt (PENDING)</Title>
            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal Từ Chối */}
            <Modal
                title="Từ chối sản phẩm"
                open={isRejectModalOpen}
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Xác nhận từ chối"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleRejectSubmit}>
                    <Form.Item 
                        name="reason" 
                        label="Lý do từ chối" 
                        rules={[{ required: true, message: 'Vui lòng nhập lý do để người bán chỉnh sửa!' }]}
                    >
                        <TextArea rows={4} placeholder="Ví dụ: Hình ảnh chưa rõ nét, mô tả sai..." />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminPendingProducts;