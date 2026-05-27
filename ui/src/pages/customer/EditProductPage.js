// src/pages/customer/EditProductPage.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Card, Typography, message, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/platformService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Tải danh mục
        categoryService.getCommonCategories().then(res => {
            if (res.success) setCategories(res.data);
        });

        // Load data cũ của sản phẩm
        productService.getProductById(id).then(res => {
            if (res.success) {
                form.setFieldsValue({
                    name: res.data.name,
                    price: res.data.price,
                    quantity: res.data.quantity,
                    description: res.data.description,
                    category_id: res.data.category?.id,
                    images: res.data.images?.[0] || '', // Lấy ảnh đầu tiên nếu có
                });
            }
        }).catch(() => message.error('Lỗi khi tải dữ liệu sản phẩm'));
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Định dạng lại payload trước khi gửi
            const payload = {
                ...values,
                images: values.images ? [values.images] : []
            };
            const res = await productService.updateProduct(id, payload);
            if (res.success) {
                message.success('Cập nhật thành công! Trạng thái đã chuyển về Chờ Duyệt.');
                navigate(`/customer/products/${id}`);
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
            <Title level={4}>Chỉnh Sửa Sản Phẩm</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true }]} style={{ flex: 1 }}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng kho" rules={[{ required: true }]} style={{ flex: 1 }}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </div>
                
                {/* 2 Trường mới bổ sung */}
                <Form.Item name="category_id" label="Danh mục chung" rules={[{ required: true }]}>
                    <Select placeholder="Chọn danh mục">
                        {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="images" label="Link Ảnh">
                    <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>

                <Form.Item name="description" label="Mô tả">
                    <TextArea rows={4} />
                </Form.Item>
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>Lưu Thay Đổi</Button>
                </div>
            </Form>
        </Card>
    );
};

export default EditProductPage;