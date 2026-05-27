// src/components/common/StatusBadge.js
import React from 'react';
import { Tag } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons';

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'PENDING':
            return <Tag icon={<SyncOutlined spin />} color="processing">Chờ duyệt</Tag>;
        case 'APPROVED':
            return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
        case 'REJECTED':
            return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
        case 'REMOVED':
            return <Tag icon={<StopOutlined />} color="default">Đã gỡ</Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
};

export default StatusBadge;