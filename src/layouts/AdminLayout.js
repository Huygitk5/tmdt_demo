// src/layouts/AdminLayout.js
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { DashboardOutlined, SafetyCertificateOutlined, LogoutOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const menuItems = [
        // { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/admin/products/pending', icon: <SafetyCertificateOutlined />, label: 'Duyệt Sản Phẩm' },
        { key: '/admin/products/approved', icon: <CheckCircleOutlined />, label: 'Quản Lý SP Đang Bán' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark" style={{ background: '#001529' }}>
                <div style={{ height: 64, margin: 16, color: '#1890ff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                    ADMIN PANEL
                </div>
                <Menu 
                    theme="dark" 
                    selectedKeys={[location.pathname]} 
                    mode="inline" 
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                    <span style={{ marginRight: 16 }}>Admin: <b>{user?.name}</b></span>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
                </Header>
                <Content style={{ margin: '16px', padding: 24, background: '#fff', minHeight: 280, borderRadius: 8 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;