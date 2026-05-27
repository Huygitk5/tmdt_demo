import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Checkbox, Card, Typography, message, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { platformService, categoryService } from '../../services/platformService';
import { productService } from '../../services/productService';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateProductPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Data states
    const [categories, setCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    
    // Dynamic fields state: { platformId: [array_of_extra_fields] }
    const [extraFieldsMap, setExtraFieldsMap] = useState({});
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);

    useEffect(() => {
        // Load Categories chung & Platforms
        Promise.all([
            categoryService.getCommonCategories(),
            platformService.getAllPlatforms()
        ]).then(([catRes, platRes]) => {
            if (catRes.success) setCategories(catRes.data);
            if (platRes.success) setPlatforms(platRes.data);
        }).catch(() => message.error('Lỗi khi tải dữ liệu khởi tạo'));
    }, []);

    // Xử lý khi user chọn/bỏ chọn sàn
    const handlePlatformChange = async (checkedValues) => {
        setSelectedPlatforms(checkedValues);
        
        // Fetch extra fields cho các sàn mới được chọn
        const newExtraFieldsMap = { ...extraFieldsMap };
        for (const platId of checkedValues) {
            if (!newExtraFieldsMap[platId]) {
                try {
                    const res = await platformService.getExtraFields(platId);
                    if (res.success) {
                        newExtraFieldsMap[platId] = res.data;
                    }
                } catch (error) {
                    console.error("Lỗi fetch extra fields cho sàn", platId);
                }
            }
        }
        setExtraFieldsMap(newExtraFieldsMap);
    };

    const onFinish = async (values) => {
        setLoading(true);
        // Build payload gửi lên backend theo đúng format
        const payload = {
            name: values.name,
            description: values.description,
            price: values.price,
            quantity: values.quantity,
            category_id: values.category_id,
            images: values.images ? [values.images] : [], // Tạm thời dùng 1 ảnh dạng text
            platforms: selectedPlatforms.map(platId => {
                // Gom extra values của sàn tương ứng
                const extraValues = [];
                const fields = extraFieldsMap[platId] || [];
                fields.forEach(f => {
                    const val = values[`extra_${platId}_${f.id}`];
                    if (val) {
                        extraValues.push({ field_id: f.id, value: val.toString() });
                    }
                });
                return { platform_id: platId, extra_values: extraValues };
            })
        };

        try {
            const res = await productService.createProduct(payload);
            if (res.success) {
                message.success('Tạo sản phẩm và gửi duyệt thành công!');
                navigate('/customer/products');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Tạo sản phẩm thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Title level={4}>Đăng Bán Sản Phẩm Mới</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Phần thông tin chung */}
                    <div>
                        <Divider orientation="left">Thông tin cơ bản</Divider>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                            <Input placeholder="Nhập tên sản phẩm..." />
                        </Form.Item>
                        
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <InputNumber style={{ width: '100%' }} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                            
                            <Form.Item name="quantity" label="Số lượng kho" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </div>

                        <Form.Item name="category_id" label="Danh mục chung" rules={[{ required: true }]}>
                            <Select placeholder="Chọn danh mục">
                                {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item name="images" label="Link Ảnh (Tạm thời)">
                            <Input placeholder="https://example.com/image.jpg" />
                        </Form.Item>

                        <Form.Item name="description" label="Mô tả sản phẩm">
                            <TextArea rows={4} placeholder="Nhập mô tả..." />
                        </Form.Item>
                    </div>

                    {/* Phần cấu hình đăng sàn */}
                    <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                        <Divider orientation="left">Đăng lên các Sàn TMĐT</Divider>
                        <Checkbox.Group style={{ width: '100%' }} onChange={handlePlatformChange}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {platforms.map(p => (
                                    <Card key={p.id} size="small" style={{ borderLeft: `4px solid ${p.themeColor || '#1890ff'}` }}>
                                        <Checkbox value={p.id}><b style={{ fontSize: '16px' }}>{p.name}</b></Checkbox>
                                        
                                        {/* Render động form riêng của sàn nếu sàn được tick */}
                                        {selectedPlatforms.includes(p.id) && extraFieldsMap[p.id] && (
                                            <div style={{ marginTop: 12, paddingLeft: 24 }}>
                                                {extraFieldsMap[p.id].map(field => (
                                                    <Form.Item 
                                                        key={field.id}
                                                        name={`extra_${p.id}_${field.id}`}
                                                        label={field.fieldLabel}
                                                        rules={[{ required: field.isRequired, message: `Bắt buộc nhập ${field.fieldLabel.toLowerCase()}` }]}
                                                        style={{ marginBottom: 12 }}
                                                    >
                                                        {field.fieldType === 'NUMBER' ? (
                                                            <InputNumber style={{ width: '100%' }} />
                                                        ) : (
                                                            <Input />
                                                        )}
                                                    </Form.Item>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </Checkbox.Group>
                    </div>
                </div>

                <Divider />
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                        Tạo & Gửi Duyệt
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default CreateProductPage;