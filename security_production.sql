-- RESTAURANT-APP GÜVENLİK YAPILANDIRMASI (PRODUCTION)

-- 1. RLS'İ TÜM TABLOLARDA AKTİF ET
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_status ENABLE ROW LEVEL SECURITY;

-- 2. POLİTİKALARI TEMİZLE (Varsa eskileri siler)
DROP POLICY IF EXISTS "Public Select" ON categories;
DROP POLICY IF EXISTS "Staff All" ON categories;
DROP POLICY IF EXISTS "Public Select" ON menu_items;
DROP POLICY IF EXISTS "Staff All" ON menu_items;
DROP POLICY IF EXISTS "Public Insert" ON orders;
DROP POLICY IF EXISTS "Public Select Orders" ON orders;
DROP POLICY IF EXISTS "Staff All Orders" ON orders;
DROP POLICY IF EXISTS "Public Insert Items" ON order_items;
DROP POLICY IF EXISTS "Public Select Items" ON order_items;
DROP POLICY IF EXISTS "Staff All Items" ON order_items;
DROP POLICY IF EXISTS "Public Insert Res" ON reservations;
DROP POLICY IF EXISTS "Staff All Res" ON reservations;
DROP POLICY IF EXISTS "Public Select Status" ON table_status;
DROP POLICY IF EXISTS "Staff All Status" ON table_status;

-- 3. KATEGORİLER VE MENÜ (Müşteri okur, Personel yönetir)
CREATE POLICY "Public Select" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Staff All" ON categories FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Select" ON menu_items FOR SELECT TO anon USING (true);
CREATE POLICY "Staff All" ON menu_items FOR ALL TO authenticated USING (true);

-- 4. SİPARİŞLER (Müşteri oluşturur ve durumunu görür, Personel yönetir)
CREATE POLICY "Public Insert" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public Select Orders" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "Staff All Orders" ON orders FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Insert Items" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public Select Items" ON order_items FOR SELECT TO anon USING (true);
CREATE POLICY "Staff All Items" ON order_items FOR ALL TO authenticated USING (true);

-- 5. REZERVASYONLAR (Müşteri sadece oluşturur, Personel yönetir)
-- ÖNEMLİ: Müşteri başkasının rezervasyonunu GÖREMEZ (SELECT yetkisi yok)
CREATE POLICY "Public Insert Res" ON reservations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Staff All Res" ON reservations FOR ALL TO authenticated USING (true);

-- 6. MASA DURUMLARI (Müşteri masaların doluluğunu görür, Personel günceller)
CREATE POLICY "Public Select Status" ON table_status FOR SELECT TO anon USING (true);
CREATE POLICY "Staff All Status" ON table_status FOR ALL TO authenticated USING (true);
