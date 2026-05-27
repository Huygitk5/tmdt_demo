// src/pages/public/PlatformPage.js
import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Layout, Tag, Spin, message, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { platformService } from '../../services/platformService';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const PlatformPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [platform, setPlatform] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Gọi API lấy thông tin sàn
                const pRes = await platformService.getPlatformById(id);
                if (pRes.success) setPlatform(pRes.data);

                // Gọi API lấy sản phẩm đã duyệt của sàn này
                const prodRes = await platformService.getPlatformProducts(id);
                if (prodRes.success) setProducts(prodRes.data);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu sàn');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    if (!platform) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy Sàn TMĐT này.</div>;

    const themeColor = platform.themeColor || '#1890ff';

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Header style={{ background: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {platform.logoUrl && <img src={platform.logoUrl} alt="logo" style={{ height: 40, marginRight: 16 }} />}
                    <Title level={3} style={{ color: 'white', margin: 0 }}>{platform.name}</Title>
                </div>
                <div>
                    <Button type="default" onClick={() => navigate('/login')}>Đăng Nhập Bán Hàng</Button>
                </div>
            </Header>
            <Content style={{ padding: '24px 50px' }}>
                <Title level={4} style={{ marginBottom: 24 }}><ShoppingOutlined /> Sản phẩm đang bán</Title>
                <Row gutter={[16, 16]}>
                    {products.length === 0 ? (
                        <Col span={24}><Text type="secondary">Chưa có sản phẩm nào trên sàn này.</Text></Col>
                    ) : (
                        products.map(p => (
                            <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                                <Card
                                    hoverable
                                    cover={<img alt={p.name} src={p.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'} style={{ height: 200, objectFit: 'cover' }} />}
                                >
                                    <Meta 
                                        title={p.name} 
                                        description={
                                            <div>
                                                <div style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}>
                                                    {`${p.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                </div>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Tag color={themeColor}>{p.category?.name}</Tag>
                                                </div>
                                            </div>
                                        } 
                                    />
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Content>
        </Layout>
    );
};

export default PlatformPage;