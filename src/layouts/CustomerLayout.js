// src/layouts/CustomerLayout.js
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { DashboardOutlined, ShoppingCartOutlined, PlusCircleOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const menuItems = [
        { key: '/customer/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/customer/products', icon: <ShoppingCartOutlined />, label: 'Sản phẩm của tôi' },
        { key: '/customer/products/create', icon: <PlusCircleOutlined />, label: 'Đăng bán sản phẩm' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark">
                <div style={{ height: 64, margin: 16, color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                    Multi-EC
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
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ marginRight: 16 }}>Xin chào, <b>{user?.name}</b></span>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
                </Header>
                <Content style={{ margin: '16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <Outlet /> {/* Render các trang con tại đây */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default CustomerLayout;