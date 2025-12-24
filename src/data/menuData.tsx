import { 
  Soup, 
  UtensilsCrossed, 
  Leaf, 
  ChefHat, 
  Coffee 
} from "lucide-react";
import React from 'react';

// --- TYPES ---
export type Category = "Başlangıçlar" | "Ana Yemekler" | "Salatalar" | "Tatlılar" | "İçecekler";

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: Category;
  popular?: boolean;
};

// --- DATA ---
export const CATEGORIES: { name: Category; icon: React.ElementType }[] = [
  { name: "Başlangıçlar", icon: Soup },
  { name: "Ana Yemekler", icon: UtensilsCrossed },
  { name: "Salatalar", icon: Leaf },
  { name: "Tatlılar", icon: ChefHat },
  { name: "İçecekler", icon: Coffee },
];

export const MENU_ITEMS: MenuItem[] = [
  // Başlangıçlar
  { id: "1", name: "Izgara Karides", desc: "Özel zeytinyağı, sarımsak ve limon marinasyonu, roka yatağında", price: 460, category: "Başlangıçlar" },
  { id: "2", name: "Trüflü Patates Püresi", desc: "Siyah trüf yağı ile zenginleştirilmiş, ekstra kremalı", price: 190, category: "Başlangıçlar" },
  { id: "3", name: "Humus", desc: "Nohut püresi, tahin, sarımsak, zeytinyağı ve taze pide", price: 200, category: "Başlangıçlar" },
  { id: "4", name: "Muhammara", desc: "Kırmızı biber, ceviz, sarımsak ve nar ekşisi, Antep fıstığı ile", price: 180, category: "Başlangıçlar" },
  { id: "5", name: "Zeytinyağlı Yaprak Sarma", desc: "Pirinç, kuş üzümü, çam fıstığı ve limon aroması", price: 150, category: "Başlangıçlar", popular: true  },
  { id: "6", name: "Sigara Böreği", desc: "Peynir ve ıspanaklı, yoğurt eşliğinde", price: 150, category: "Başlangıçlar" },

  // Ana Yemekler
  { id: "10", name: "Kuzu İncik", desc: "6 saat pişirilmiş, patates püresi ve demi-glace sos ile", price: 420, category: "Ana Yemekler", popular: true },
  { id: "11", name: "Dana Madalyon", desc: "Demi-glace sos ve kırmızı şarap dokunuşu ile", price: 520, category: "Ana Yemekler" },
  { id: "12", name: "İskender", desc: "Döner et, sıcak tereyağı, yoğurt sosu, közlenmiş domates ve biber", price: 450, category: "Ana Yemekler" },
  { id: "13", name: "Hünkar Beğendi", desc: "Kuzu eti ve közlenmiş patlıcan püresi üzerinde beşamel sos", price: 400, category: "Ana Yemekler" },
  { id: "14", name: "Ali Nazik Kebap", desc: "Izgara patlıcan püresi ve yoğurt ile kuzu tandır", price: 600, category: "Ana Yemekler" },
  { id: "15", name: "Izgara Somon", desc: "Tereyağı ve limon marinasyonu, ızgara sebzeler ile", price: 390, category: "Ana Yemekler" },

  // Salatalar
  { id: "20", name: "Susamlı Tavuk Salata", desc: "Portakal sosu ile süslenmiş", price: 100, category: "Salatalar" },
  { id: "21", name: "Ilık Bonfile Salata", desc: "Izgara bonfile parçaları ve Akdeniz yeşilliği", price: 150, category: "Salatalar", popular: true },
  { id: "22", name: "Tulum Salata", desc: "Akdeniz yeşilliği ve tulum peyniri, özel sos ile", price: 85, category: "Salatalar" },
  { id: "23", name: "Ton Balıklı Salata", desc: "Akdeniz yeşilliği, ton balığı, salatalık, havuç, mısır", price: 140, category: "Salatalar" },
  { id: "24", name: "Roka Salatası", desc: "Beyaz peynir ve roka yaprakları", price: 100, category: "Salatalar" },
  { id: "25", name: "Akdeniz Salatası", desc: "Mevsim yeşillikleri ve özel sos", price: 100, category: "Salatalar" },
  { id: "26", name: "Sezar Salata", desc: "Kroton ekmekler, tavuk, parmesan, göbek marul ve sezar sos", price: 170, category: "Salatalar" },

  // Tatlılar
  { id: "30", name: "San Sebastian Cheesecake", desc: "Bask usulü, akışkan kıvamlı", price: 210, category: "Tatlılar", popular: true },
  { id: "31", name: "Fıstıklı Katmer", desc: "Antep fıstığı ve taze kaymak", price: 230, category: "Tatlılar" },
  { id: "32", name: "Baklava", desc: "Ceviz içi ve şerbetle tatlandırılmış", price: 380, category: "Tatlılar" },
  { id: "33", name: "Sütlaç", desc: "Fırında, üzeri tarçınlı geleneksel lezzet", price: 200, category: "Tatlılar" },
  { id: "34", name: "Kazandibi", desc: "Karamelize pirinç unu ve süt, tarçın ile", price: 230, category: "Tatlılar" },

  // İçecekler
  { id: "40", name: "Çay", desc: "Taze demlenmiş", price: 40, category: "İçecekler" },
  { id: "41", name: "Bitki Çayları", desc: "Çeşitli bitki harmanları", price: 50, category: "İçecekler" },
  { id: "42", name: "Türk Kahvesi", desc: "Geleneksel", price: 70, category: "İçecekler" },
  { id: "43", name: "Latte", desc: "Espresso ve sıcak süt", price: 120, category: "İçecekler" },
  { id: "44", name: "Cappuccino", desc: "Espresso ve süt köpüğü", price: 120, category: "İçecekler" },
  { id: "45", name: "Americano", desc: "Sıcak su ile inceltilmiş espresso", price: 110, category: "İçecekler" },
  { id: "46", name: "Espresso", desc: "Yoğun kahve aroması", price: 85, category: "İçecekler" },
  { id: "47", name: "Mocha", desc: "Çikolatalı kahve", price: 100, category: "İçecekler" },
  // Soft
  { id: "50", name: "Coca Cola", desc: "Kutu", price: 70, category: "İçecekler" },
  { id: "51", name: "Fanta", desc: "Kutu", price: 70, category: "İçecekler" },
  { id: "52", name: "Sprite", desc: "Kutu", price: 70, category: "İçecekler" },
  { id: "53", name: "Soda", desc: "Sade", price: 40, category: "İçecekler" },
  { id: "54", name: "Ayran", desc: "Naneli veya sade", price: 40, category: "İçecekler" },
  { id: "55", name: "Meyveli Sodalar", desc: "Çeşitli meyve aromalı", price: 50, category: "İçecekler" },
];
