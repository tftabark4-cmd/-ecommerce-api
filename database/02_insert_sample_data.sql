INSERT INTO categories (name, description) VALUES
('أجهزة الحاسوب', 'لابتوبات وشاشات وأجهزة لوحية'),
('الهواتف', 'هواتف ذكية وساعات ذكية وإكسسواراتها'),
('الملحقات', 'لوحات مفاتيح وفأرة وشواحن وكابلات'),
('الصوتيات', 'سماعات ومكبرات صوت وميكروفونات'),
('الألعاب', 'أدوات تحكم وملحقات الألعاب');
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Rami Odeh', 'rami.odeh@example.com', '0791234567', 'hashed_pw_1', 'admin'),
('Layla Hassan', 'layla.hassan@example.com', '0797654321', 'hashed_pw_2', 'customer'),
('Omar Khalil', 'omar.khalil@example.com', '0781112233', 'hashed_pw_3', 'customer'),
('Sara Ahmad', 'sara.ahmad@example.com', '0789998877', 'hashed_pw_4', 'customer'),
('Yousef Nasser', 'yousef.nasser@example.com', '0776665544', 'hashed_pw_5', 'customer'),
('Dana Salem', 'dana.salem@example.com', '0795554433', 'hashed_pw_6', 'customer'),
('Khaled Mansour', 'khaled.mansour@example.com', '0783332211', 'hashed_pw_7', 'customer'),
('Maya Fares', 'maya.fares@example.com', '0798887766', 'hashed_pw_8', 'customer');
INSERT INTO products (category_id, name, description, price, stock_quantity, sku) VALUES
(1, 'Laptop Dell XPS 13', 'لابتوب خفيف بمعالج Core i7', 899.99, 15, 'SKU-COMP-001'),
(1, 'Laptop HP Pavilion', 'لابتوب متوسط الأداء للاستخدام اليومي', 549.50, 20, 'SKU-COMP-002'),
(1, 'شاشة Samsung 24 بوصة', 'شاشة Full HD للمكتب', 129.00, 30, 'SKU-COMP-003'),
(1, 'جهاز لوحي Lenovo Tab', 'جهاز لوحي بشاشة 10 بوصة', 199.00, 0, 'SKU-COMP-004'),
(2, 'iPhone 14', 'هاتف ذكي بشاشة Super Retina', 799.00, 10, 'SKU-PHONE-001'),
(2, 'Samsung Galaxy S23', 'هاتف ذكي بكاميرا 108 ميجابكسل', 749.00, 12, 'SKU-PHONE-002'),
(2, 'Apple Watch Series 9', 'ساعة ذكية بمستشعر صحي', 399.00, 18, 'SKU-PHONE-003'),
(2, 'غطاء حماية آيفون', 'غطاء سيليكون واقي', 15.99, 50, 'SKU-PHONE-004'),
(3, 'لوحة مفاتيح Logitech', 'لوحة مفاتيح لاسلكية', 45.00, 25, 'SKU-ACC-001'),
(3, 'فأرة Logitech MX', 'فأرة لاسلكية دقيقة', 35.50, 30, 'SKU-ACC-002'),
(3, 'شاحن سريع 65 واط', 'شاحن USB-C سريع', 22.00, 40, 'SKU-ACC-003'),
(3, 'كابل USB-C', 'كابل شحن ونقل بيانات 1 متر', 8.99, 60, 'SKU-ACC-004'),
(3, 'حامل لابتوب معدني', 'حامل قابل للطي لرفع اللابتوب', 28.00, 0, 'SKU-ACC-005'),
(4, 'سماعة لاسلكية Sony', 'سماعة رأس بخاصية إلغاء الضوضاء', 249.00, 14, 'SKU-AUD-001'),
(4, 'ميكروفون Blue Yeti', 'ميكروفون احترافي للبث', 99.00, 8, 'SKU-AUD-002'),
(4, 'مكبر صوت JBL', 'مكبر صوت بلوتوث محمول', 59.99, 22, 'SKU-AUD-003'),
(4, 'سماعات أذن Airpods', 'سماعات لاسلكية صغيرة', 129.00, 16, 'SKU-AUD-004'),
(5, 'يد تحكم PS5', 'يد تحكم أصلية لجهاز PlayStation 5', 69.99, 20, 'SKU-GAME-001'),
(5, 'سماعة ألعاب Razer', 'سماعة رأس مع ميكروفون للألعاب', 89.00, 12, 'SKU-GAME-002'),
(5, 'لوحة فأرة كبيرة', 'لوحة فأرة مقاس XL لألعاب الحاسوب', 19.99, 35, 'SKU-GAME-003');
INSERT INTO orders (user_id, status, total_amount, shipping_address, notes) VALUES
(2, 'delivered', 1243.00, 'عمّان - جبل الحسين - شارع الملكة رانيا', NULL),
(2, 'pending', 71.00, 'عمّان - جبل الحسين - شارع الملكة رانيا', 'التوصيل بعد الساعة 5 مساءً'),
(3, 'confirmed', 984.97, 'إربد - شارع الجامعة', NULL),
(4, 'processing', 784.50, 'الزرقاء - حي الأمير حمزة', NULL),
(4, 'shipped', 327.99, 'الزرقاء - حي الأمير حمزة', 'الرجاء الاتصال قبل التوصيل'),
(5, 'pending', 571.50, 'العقبة - وسط البلد', NULL),
(5, 'cancelled', 249.00, 'العقبة - وسط البلد', 'ألغى العميل الطلب'),
(6, 'delivered', 1058.98, 'السلط - شارع الملك طلال', NULL),
(6, 'confirmed', 678.48, 'السلط - شارع الملك طلال', NULL),
(7, 'processing', 611.47, 'مأدبا - حي الجامعة', NULL);
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
-- Order 1
(1, 1, 1, 899.99, 899.99),
(1, 17, 1, 129.00, 129.00),
(1, 9, 2, 45.00, 90.00),
-- Order 2
(2, 12, 2, 8.99, 17.98),
(2, 11, 2, 22.00, 44.00),
(2, 20, 1, 19.99, 19.99),
-- Order 3
(3, 6, 1, 749.00, 749.00),
(3, 8, 2, 15.99, 31.98),
(3, 10, 1, 35.50, 35.50),
-- Order 4
(4, 2, 1, 549.50, 549.50),
(4, 15, 1, 99.00, 99.00),
(4, 16, 1, 59.99, 59.99),
-- Order 5
(5, 14, 1, 249.00, 249.00),
(5, 19, 1, 89.00, 89.00),
-- Order 6
(6, 7, 1, 399.00, 399.00),
(6, 18, 1, 69.99, 69.99),
(6, 9, 1, 45.00, 45.00),
-- Order 7 (cancelled)
(7, 14, 1, 249.00, 249.00),
(7, 20, 1, 19.99, 19.99),
-- Order 8
(8, 5, 1, 799.00, 799.00),
(8, 17, 1, 129.00, 129.00),
(8, 16, 2, 59.99, 119.98),
-- Order 9
(9, 3, 2, 129.00, 258.00),
(9, 11, 3, 22.00, 66.00),
(9, 9, 1, 45.00, 45.00),
-- Order 10
(10, 1, 1, 899.99, 899.99),
(10, 12, 1, 8.99, 8.99);
UPDATE orders o
SET total_amount = (
SELECT COALESCE(SUM(oi.subtotal), 0)
FROM order_items oi
WHERE oi.order_id = o.id
);
INSERT INTO payments (order_id, payment_method, payment_status, amount, transaction_reference, paid_at) VALUES
(1, 'card', 'paid', 1118.99, 'TXN-1001', '2026-06-10 14:30:00'),
(2, 'cash', 'pending', 81.97, NULL, NULL),
(3, 'card', 'paid', 816.48, 'TXN-1003', '2026-06-15 11:20:00'),
(4, 'bank_transfer', 'paid', 708.49, 'TXN-1004', '2026-06-18 09:00:00'),
(5, 'wallet', 'paid', 338.00, 'TXN-1005', '2026-06-20 16:45:00'),
(6, 'cash', 'pending', 513.99, NULL, NULL),
(7, 'card', 'failed', 268.99, 'TXN-1007', NULL),
(8, 'bank_transfer', 'paid', 1047.98, 'TXN-1008', '2026-06-25 10:10:00');