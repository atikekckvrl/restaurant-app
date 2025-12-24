-- 1. KATEGORİLER TABLOSU
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL, -- Lucide ikon ismi (örn: 'Soup', 'Coffee')
  display_order INT DEFAULT 0
);

-- 2. MENÜ ÖĞELERİ TABLOSU
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. SİPARİŞLER TABLOSU
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_no TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, preparing, served, cancelled, completed
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. SİPARİŞ DETAYLARI TABLOSU
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- ÖRNEK VERİ EKLEME (Opsiyonel - Başlangıç için)
-- 5. MASA DURUMLARI TABLOSU (Manuel Kontrol)
CREATE TABLE table_status (
  table_no TEXT PRIMARY KEY,
  status TEXT DEFAULT 'available', -- available, occupied, reserved
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Başlangıç için 40 masayı da boş olarak ekleyelim
-- 6. REZERVASYONLAR TABLOSU
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  res_date DATE NOT NULL,
  res_time TIME NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, seated
  table_no TEXT, -- Personel tarafından atanacak
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
