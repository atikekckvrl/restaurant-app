import React from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Star, Sparkles, GlassWater } from "lucide-react";

const MenuPage: React.FC = () => {
  const menuItems = {
    "Başlangıçlar": [
      { name: "Izgara Halloumi", price: "190₺", desc: "Nar taneleri ve bal sosuyla servis edilir." },
      { name: "Karamelize Soğanlı Bruschetta", price: "160₺", desc: "Közlenmiş domates, fesleğen ve zeytinyağı dokunuşuyla." },
      { name: "Lâl Meze Tabağı", price: "240₺", desc: "Günün taze meze çeşitlerinden oluşan karışık tabak." },
      { name: "Köz Patlıcan Ezme", price: "155₺", desc: "Zeytinyağlı ve sarımsaklı klasik lezzet." },
      { name: "Humus Üzeri Pastırma", price: "185₺", desc: "Gaziantep usulü humus, çıtır pastırma ile." },
    ],
    "Ana Yemekler": [
      { name: "Dana Madalyon", price: "420₺", desc: "Kırmızı şarap sosu ve trüf patates püresiyle." },
      { name: "Izgara Levrek", price: "380₺", desc: "Zeytinyağlı sebze yatağında servis edilir." },
      { name: "Tereyağlı Risotto", price: "310₺", desc: "Kuşkonmaz ve parmesanla tamamlanmış klasik İtalyan lezzeti." },
      { name: "Bonfile Stroganoff", price: "395₺", desc: "Kremalı mantar sosu ve tereyağlı pilav ile." },
      { name: "Kuzu İncik", price: "440₺", desc: "Fırında yavaş pişirilmiş, demiglace sos ile." },
      { name: "Tavada Somon", price: "360₺", desc: "Narenciye sosu ve baby sebzelerle." },
    ],
    "Tatlı & Şarap": [
      { name: "Sufle Lâl", price: "190₺", desc: "Sıcak çikolata dolgulu, vanilyalı dondurma ile." },
      { name: "Karamelli Cheesecake", price: "175₺", desc: "Hafif ve ipeksi dokusuyla klasik tat." },
      { name: "Tiramisu", price: "185₺", desc: "Kahve ve mascarpone kremasıyla hazırlanan İtalyan klasiği." },
      { name: "Limonlu Creme Brulee", price: "195₺", desc: "İnce karamel tabakası altında ipeksi krema." },
      { name: "Ev Şarabı (Kadeh)", price: "150₺", desc: "Günün seçimi, kırmızı veya beyaz." },
      { name: "Kav Şarapları (Şişe)", price: "Başlangıç 550₺", desc: "Seçilmiş yerli & yabancı markalardan öneriler." },
    ],
    "Alkolsüz İçecekler": [
      { name: "Taze Nane Limonata", price: "110₺", desc: "Ev yapımı, doğal limon suyu ve taze nane yapraklarıyla." },
      { name: "Soğuk Kahve (Iced Latte)", price: "130₺", desc: "Espresso ve soğuk süt karışımı, buzlu servis." },
      { name: "Taze Sıkma Portakal Suyu", price: "125₺", desc: "Günün taze portakallarından sıkma." },
      { name: "Ev Yapımı Şeftali Çayı", price: "115₺", desc: "Demlenmiş çay ve taze şeftali püresiyle." },
      { name: "Soda & Maden Suyu", price: "60₺", desc: "Doğal mineralli ferahlatıcı içecek." },
      { name: "Klasik Limonata", price: "100₺", desc: "Şeker oranı dengelenmiş geleneksel tarif." },
    ],
  };

  return (
    <section className="relative min-h-screen text-white bg-black overflow-hidden">
      {/* === Arka Plan === */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-10"
        >
          <source src="/restaurant-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#000000]/95 to-[#050505]" />
      </div>

      {/* === Başlık === */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center mt-28 px-10"
      >
        <h1 className="text-6xl md:text-7xl font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#e8d57b] to-[#f6eab1] drop-shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          LÂL Menü
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
          Her tabakta zarafet, her yudumda denge.  
          Şefimizin ellerinden çıkan özel tatlarla gastronomi sanatına davetlisiniz.
        </p>
      </motion.div>

      {/* === Kategori Kartları === */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10 mt-20 px-14 max-w-7xl mx-auto">
        {[
          {
            icon: <UtensilsCrossed className="w-14 h-14 text-[#f8e1a1] mx-auto mb-5" />,
            title: "Başlangıçlar",
            desc: "Lezzet yolculuğuna hafif ama etkileyici bir başlangıç.",
          },
          {
            icon: <Star className="w-14 h-14 text-[#f8e1a1] mx-auto mb-5" />,
            title: "Ana Yemekler",
            desc: "Günün en özel anı için ustalıkla hazırlanmış tabaklar.",
          },
          {
            icon: <Sparkles className="w-14 h-14 text-[#f8e1a1] mx-auto mb-5" />,
            title: "Tatlı & Şarap",
            desc: "Kusursuz bir final ve seçilmiş şarap eşleşmeleri.",
          },
          {
            icon: <GlassWater className="w-14 h-14 text-[#f8e1a1] mx-auto mb-5" />,
            title: "Alkolsüz İçecekler",
            desc: "Taze, ferah ve özenle hazırlanmış içecek çeşitleri.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white/10 border border-[#c9a45c]/30 rounded-3xl p-10 backdrop-blur-md text-center
                       shadow-[0_0_40px_rgba(201,164,92,0.15)] hover:shadow-[0_0_60px_rgba(201,164,92,0.3)] 
                       overflow-hidden transition-all duration-500 group"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,215,130,0.3),transparent_70%)] transition-all duration-500" />
            {item.icon}
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#e8d08c] to-[#cfa24f] bg-clip-text text-transparent mb-3">
              {item.title}
            </h3>
            <p className="text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* === Menü Listesi === */}
      <div className="relative z-10 mt-28 w-full bg-black/85 backdrop-blur-md py-24 px-12 border-t border-[#a38747]/30">
        <div className="max-w-6xl mx-auto">
          {Object.entries(menuItems).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <h2 className="text-4xl font-serif text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#d4b971] to-[#f5e5a2]">
                {category}
              </h2>
              <div className="space-y-8 px-4 md:px-10">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center border-b border-gray-800 pb-4 hover:border-[#d4af37]/60"
                  >
                    <div className="max-w-[70%]">
                      <h3 className="text-xl text-gray-100 font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                    </div>
                    <span className="text-[#e3c96f] text-lg font-medium whitespace-nowrap">
                      {item.price}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuPage;
