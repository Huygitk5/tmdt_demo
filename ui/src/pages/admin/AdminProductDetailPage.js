// src/pages/admin/AdminProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Typography, Space, message, Modal, Input, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/common/StatusBadge';

const { Title } = Typography;
const { TextArea } = Input;

const AdminProductDetailPage = () => {
    const { id } = useParams(); // id của product_platform
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await adminService.getProductPlatformDetail(id);
            if (res.success) setDetail(res.data);
        } catch (error) {
            message.error('Lỗi tải chi tiết sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const res = await adminService.approveProduct(id);
            if (res.success) {
                message.success('Đã duyệt sản phẩm!');
                navigate('/admin/products/pending');
            }
        } catch (error) {
            message.error('Lỗi khi duyệt');
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return message.warning('Vui lòng nhập lý do');
        try {
            const res = await adminService.rejectProduct(id, { reason: rejectReason });
            if (res.success) {
                message.success('Đã từ chối sản phẩm!');
                setIsRejectModalOpen(false);
                navigate('/admin/products/pending');
            }
        } catch (error) {
            message.error('Lỗi khi từ chối');
        }
    };

    if (!detail) return <Card loading={loading} />;

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Title level={4}>Kiểm duyệt sản phẩm: {detail.product?.name}</Title>
                <Space>
                    <Button onClick={() => navigate(-1)}>Quay lại</Button>
                    <Button danger onClick={() => setIsRejectModalOpen(true)}>Từ Chối</Button>
                    <Button type="primary" style={{ background: '#52c41a' }} onClick={handleApprove}>Phê Duyệt</Button>
                </Space>
            </div>

            <Descriptions bordered column={2}>
                <Descriptions.Item label="Trạng thái hiện tại"><StatusBadge status={detail.status} /></Descriptions.Item>
                <Descriptions.Item label="Giá bán">{detail.product?.price} VNĐ</Descriptions.Item>
                <Descriptions.Item label="Người bán">{detail.product?.customer?.name}</Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>{detail.product?.description}</Descriptions.Item>
                
                <Descriptions.Item label="Thông tin riêng cho Sàn" span={2}>
                    {detail.extraValues?.map((ev, idx) => (
                        <div key={idx} style={{ marginBottom: 4 }}>
                            <Tag color="blue">{ev.fieldLabel}</Tag>: <b>{ev.value}</b>
                        </div>
                    ))}
                    {(!detail.extraValues || detail.extraValues.length === 0) && 'Không có'}
                </Descriptions.Item>
            </Descriptions>

            <Modal
                title="Từ chối sản phẩm"
                open={isRejectModalOpen}
                onOk={handleReject}
                onCancel={() => setIsRejectModalOpen(false)}
                okText="Xác nhận"
                okButtonProps={{ danger: true }}
            >
                <p>Nhập lý do để người bán cập nhật lại:</p>
                <TextArea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            </Modal>
        </Card>
    );
};

export default AdminProductDetailPage;