-- TABLOLARI DIŞARIYA TAMAMEN AÇ (Hızlı test ve başlangıç için RLS'i kapat)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE table_status DISABLE ROW LEVEL SECURITY;

-- Eğer RLS açık kalsın derseniz aşağıdaki politikaları çalıştırabilirsiniz
-- CREATE POLICY "Public Insert" ON public.reservations FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public Access" ON public.categories FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON public.menu_items FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON public.orders FOR ALL USING (true);
-- CREATE POLICY "Public Access" ON public.order_items FOR ALL USING (true);
-- CREATE POLICY "Public Access" ON public.reservations FOR ALL USING (true);
-- CREATE POLICY "Public Access" ON public.table_status FOR ALL USING (true);
