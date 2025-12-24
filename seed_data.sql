-- ÖNCE MEVCUT VERİLERİ TEMİZLE (İsteğe bağlı, temiz bir başlangıç için)
TRUNCATE categories, menu_items RESTART IDENTITY CASCADE;

-- 1. KATEGORİLERİ EKLE VE ID'LERİ DEĞİŞKENLERE ATAMAK İÇİN GEÇİCİ TABLO VEYA DOĞRUDAN EKLEME
WITH inserted_categories AS (
  INSERT INTO categories (name, icon_name, display_order) VALUES 
  ('Başlangıçlar', 'Soup', 1),
  ('Ana Yemekler', 'UtensilsCrossed', 2),
  ('Salatalar', 'Leaf', 3),
  ('Tatlılar', 'ChefHat', 4),
  ('İçecekler', 'Coffee', 5)
  RETURNING id, name
)
INSERT INTO menu_items (category_id, name, description, price, is_popular)
SELECT 
  ic.id,
  m.name,
  m.description,
  m.price,
  m.is_popular
FROM (
  VALUES 
    -- Başlangıçlar
    ('Izgara Karides', 'Özel zeytinyağı, sarımsak ve limon marinasyonu, roka yatağında', 460, false, 'Başlangıçlar'),
    ('Trüflü Patates Püresi', 'Siyah trüf yağı ile zenginleştirilmiş, ekstra kremalı', 190, false, 'Başlangıçlar'),
    ('Humus', 'Nohut püresi, tahin, sarımsak, zeytinyağı ve taze pide', 200, false, 'Başlangıçlar'),
    ('Muhammara', 'Kırmızı biber, ceviz, sarımsak ve nar ekşisi, Antep fıstığı ile', 180, false, 'Başlangıçlar'),
    ('Zeytinyağlı Yaprak Sarma', 'Pirinç, kuş üzümü, çam fıstığı ve limon aroması', 150, true, 'Başlangıçlar'),
    ('Sigara Böreği', 'Peynir ve ıspanaklı, yoğurt eşliğinde', 150, false, 'Başlangıçlar'),
    
    -- Ana Yemekler
    ('Kuzu İncik', '6 saat pişirilmiş, patates püresi ve demi-glace sos ile', 420, true, 'Ana Yemekler'),
    ('Dana Madalyon', 'Demi-glace sos ve kırmızı şarap dokunuşu ile', 520, false, 'Ana Yemekler'),
    ('İskender', 'Döner et, sıcak tereyağı, yoğurt sosu, közlenmiş domates ve biber', 450, false, 'Ana Yemekler'),
    ('Hünkar Beğendi', 'Kuzu eti ve közlenmiş patlıcan püresi üzerinde beşamel sos', 400, false, 'Ana Yemekler'),
    ('Ali Nazik Kebap', 'Izgara patlıcan püresi ve yoğurt ile kuzu tandır', 600, false, 'Ana Yemekler'),
    ('Izgara Somon', 'Tereyağı ve limon marinasyonu, ızgara sebzeler ile', 390, false, 'Ana Yemekler'),

    -- Salatalar
    ('Susamlı Tavuk Salata', 'Portakal sosu ile süslenmiş', 100, false, 'Salatalar'),
    ('Ilık Bonfile Salata', 'Izgara bonfile parçaları ve Akdeniz yeşilliği', 150, true, 'Salatalar'),
    ('Tulum Salata', 'Akdeniz yeşilliği ve tulum peyniri, özel sos ile', 85, false, 'Salatalar'),
    ('Ton Balıklı Salata', 'Akdeniz yeşilliği, ton balığı, salatalık, havuç, mısır', 140, false, 'Salatalar'),
    ('Roka Salatası', 'Beyaz peynir ve roka yaprakları', 100, false, 'Salatalar'),
    ('Akdeniz Salatası', 'Mevsim yeşillikleri ve özel sos', 100, false, 'Salatalar'),
    ('Sezar Salata', 'Kroton ekmekler, tavuk, parmesan, göbek marul ve sezar sos', 170, false, 'Salatalar'),

    -- Tatlılar
    ('San Sebastian Cheesecake', 'Bask usulü, akışkan kıvamlı', 210, true, 'Tatlılar'),
    ('Fıstıklı Katmer', 'Antep fıstığı ve taze kaymak', 230, false, 'Tatlılar'),
    ('Baklava', 'Ceviz içi ve şerbetle tatlandırılmış', 380, false, 'Tatlılar'),
    ('Sütlaç', 'Fırında, üzeri tarçınlı geleneksel lezzet', 200, false, 'Tatlılar'),
    ('Kazandibi', 'Karamelize pirinç unu ve süt, tarçın ile', 230, false, 'Tatlılar'),

    -- İçecekler (Sıcak/Kahve)
    ('Çay', 'Taze demlenmiş', 40, false, 'İçecekler'),
    ('Bitki Çayları', 'Çeşitli bitki harmanları', 50, false, 'İçecekler'),
    ('Türk Kahvesi', 'Geleneksel', 70, false, 'İçecekler'),
    ('Latte', 'Espresso ve sıcak süt', 120, false, 'İçecekler'),
    ('Cappuccino', 'Espresso ve süt köpüğü', 120, false, 'İçecekler'),
    ('Americano', 'Sıcak su ile inceltilmiş espresso', 110, false, 'İçecekler'),
    ('Espresso', 'Yoğun kahve aroması', 85, false, 'İçecekler'),
    ('Mocha', 'Çikolatalı kahve', 100, false, 'İçecekler'),
    -- İçecekler (Soft)
    ('Coca Cola', 'Kutu', 70, false, 'İçecekler'),
    ('Fanta', 'Kutu', 70, false, 'İçecekler'),
    ('Sprite', 'Kutu', 70, false, 'İçecekler'),
    ('Soda', 'Sade', 40, false, 'İçecekler'),
    ('Ayran', 'Naneli veya sade', 40, false, 'İçecekler'),
    ('Meyveli Sodalar', 'Çeşitli meyve aromalı', 50, false, 'İçecekler')

) AS m(name, description, price, is_popular, category_name)
JOIN inserted_categories ic ON ic.name = m.category_name;
