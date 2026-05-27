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
    
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedPpId, setSelectedPpId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        setLoading(true);
        try {
            const res = await adminService.getProducts({ status: 'PENDING' });
            if (res.success) {
                setProducts(res.data.content || res.data || []);
            }
        } catch (error) {
            message.error('Lỗi tải danh sách sản phẩm chờ duyệt');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (ppId) => {
        try {
            const res = await adminService.approveProduct(ppId);
            if (res.success) {
                message.success('Đã duyệt sản phẩm thành công!');
                fetchPendingProducts(); 
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi khi duyệt sản phẩm');
        }
    };

    const openRejectModal = (ppId) => {
        setSelectedPpId(ppId);
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async (values) => {
        try {
            const res = await adminService.rejectProduct(selectedPpId, { reason: values.reason });
            if (res.success) {
                message.success('Đã từ chối sản phẩm!');
                setIsRejectModalOpen(false);
                form.resetFields();
                fetchPendingProducts(); 
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi khi từ chối sản phẩm');
        }
    };

    const columns = [
        {
            title: 'ID Duyệt',
            key: 'ppId',
            width: 100,
            // Tìm trong mảng platforms lấy ra ID của record PENDING
            render: (_, record) => record.platforms?.find(p => p.status === 'PENDING')?.id || '-'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'productName',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ'
        },
        {
            title: 'Ngày gửi',
            key: 'submittedAt',
            render: (_, record) => {
                const pp = record.platforms?.find(p => p.status === 'PENDING');
                return pp?.submittedAt ? new Date(pp.submittedAt).toLocaleString('vi-VN') : '-';
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                const pp = record.platforms?.find(p => p.status === 'PENDING');
                if (!pp) return null; // Nếu không tìm thấy ID duyệt thì ẩn nút
                
                return (
                    <Space size="middle">
                        <Button 
                            type="primary" 
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            icon={<CheckCircleOutlined />} 
                            onClick={() => handleApprove(pp.id)}
                        >
                            Duyệt
                        </Button>
                        <Button 
                            type="primary" 
                            danger 
                            icon={<CloseCircleOutlined />} 
                            onClick={() => openRejectModal(pp.id)}
                        >
                            Từ chối
                        </Button>
                    </Space>
                );
            }
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