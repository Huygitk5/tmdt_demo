INSERT INTO platforms (name, slug, logo_url, theme_color) VALUES ('Shopi', 'shopi', 'https://example.com/shopi.png', '#FF5722');
INSERT INTO platforms (name, slug, logo_url, theme_color) VALUES ('Shoptik', 'shoptik', 'https://example.com/shoptik.png', '#000000');
INSERT INTO platforms (name, slug, logo_url, theme_color) VALUES ('Alubibi', 'alubibi', 'https://example.com/alubibi.png', '#FF9800');

INSERT INTO platform_extra_fields (platform_id, field_name, field_label, field_type, is_required) VALUES (1, 'video_url', 'Link video sản phẩm', 'URL', true);
INSERT INTO platform_extra_fields (platform_id, field_name, field_label, field_type, is_required) VALUES (2, 'weight', 'Cân nặng (kg)', 'NUMBER', true);
INSERT INTO platform_extra_fields (platform_id, field_name, field_label, field_type, is_required) VALUES (2, 'dimension', 'Kích thước (cm)', 'TEXT', true);
INSERT INTO platform_extra_fields (platform_id, field_name, field_label, field_type, is_required) VALUES (3, 'warranty_months', 'Thời gian bảo hành (tháng)', 'NUMBER', true);

INSERT INTO categories (name, platform_id) VALUES ('Điện tử', NULL);
INSERT INTO categories (name, platform_id) VALUES ('Thời trang', NULL);
INSERT INTO categories (name, platform_id) VALUES ('Đồ gia dụng', NULL);
INSERT INTO categories (name, platform_id) VALUES ('Sức khỏe & Làm đẹp', NULL);
INSERT INTO categories (name, platform_id) VALUES ('Đồ ăn', 1);
INSERT INTO categories (name, platform_id) VALUES ('Đồ secondhand', 2);
