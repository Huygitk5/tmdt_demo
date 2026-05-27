import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Radio, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { platformService } from '../../services/platformService';

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('CUSTOMER');
    const [platforms, setPlatforms] = useState([]);

    // Fetch danh sách sàn nếu user chọn đăng ký làm ADMIN
    useEffect(() => {
        if (role === 'ADMIN') {
            platformService.getAllPlatforms()
                .then(res => {
                    if (res.success) setPlatforms(res.data);
                })
                .catch(() => message.error('Lỗi khi tải danh sách sàn'));
        }
    }, [role]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await authService.register(values);
            if (res.success) {
                message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '20px 0' }}>
            <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>Đăng Ký Tài Khoản</Title>
                </div>
                <Form name="register_form" onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>
                    
                    <Form.Item name="role" label="Loại tài khoản" initialValue="CUSTOMER">
                        <Radio.Group onChange={(e) => setRole(e.target.value)} buttonStyle="solid">
                            <Radio.Button value="CUSTOMER">Người Bán (Customer)</Radio.Button>
                            <Radio.Button value="ADMIN">Quản Trị Sàn (Admin)</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {role === 'ADMIN' && (
                        <Form.Item name="platform_id" label="Chọn sàn quản lý" rules={[{ required: true, message: 'Vui lòng chọn sàn!' }]}>
                            <Select placeholder="-- Chọn Sàn TMĐT --">
                                {platforms.map(p => (
                                    <Option key={p.id} value={p.id}>{p.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>Đăng Ký</Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;