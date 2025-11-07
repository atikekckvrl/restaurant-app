import React from "react";
import { motion } from "framer-motion";
import { Flame, Star, Utensils } from "lucide-react";

const About: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden bg-black">
      {/* === Arka Plan Efekti === */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25"
        >
          <source src="/restaurant-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/70 to-[#0b0b0b]"></div>
      </div>

      {/* === İçerik Kutusu === */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-6xl text-center px-8 py-20 bg-white/10 backdrop-blur-md rounded-3xl border border-[#c9a45c]/30 shadow-[0_0_80px_rgba(201,164,92,0.25)]"
      >
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-6xl md:text-7xl font-serif text-[#d4af37] mb-8 tracking-widest"
        >
          LÂL RESTAURANT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
        >
          <span className="text-[#f1d48c] font-medium">
            Zarafet, detaylarda saklıdır.
          </span>{" "}
          LÂL, geleneksel tatları çağdaş yorumlarla buluşturarak,  
          sadece bir yemek deneyimi değil; duyulara hitap eden bir sanat yolculuğu sunar.  
          Her tabak, sabrın, ustalığın ve inceliğin sessiz ifadesidir.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="italic text-[#f5d48a] text-xl font-light mb-14"
        >
          “Bir anı bırak, tadı hatırlanır; adı LÂL’dir.”
        </motion.p>

        {/* === Alt 3lü Kart === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {/* 1. Kart */}
          <motion.div
            whileHover={{ scale: 1.08, y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-black/40 border border-[#c9a45c]/30 rounded-2xl p-8 backdrop-blur-sm shadow-lg hover:shadow-[0_0_25px_rgba(201,164,92,0.3)] transition-all"
          >
            <Flame className="w-14 h-14 text-[#d4af37] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#f5d48a] mb-4">
              Zarafetin Işığında
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Işığın altınla buluştuğu ambiyansında,  
              her detay sizi zamanın dışına taşır.  
              Her masa, kendi hikayesini anlatır.
            </p>
          </motion.div>

          {/* 2. Kart */}
          <motion.div
            whileHover={{ scale: 1.08, y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-black/40 border border-[#c9a45c]/30 rounded-2xl p-8 backdrop-blur-sm shadow-lg hover:shadow-[0_0_25px_rgba(201,164,92,0.3)] transition-all"
          >
            <Utensils className="w-14 h-14 text-[#d4af37] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#f5d48a] mb-4">
              Ustalığın İzinde
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Geleneksel reçeteler, modern tekniklerle yeniden doğar.  
              Her tabak, şefin imzasını taşıyan bir sanat eseri gibidir.
            </p>
          </motion.div>

          {/* 3. Kart */}
          <motion.div
            whileHover={{ scale: 1.08, y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-black/40 border border-[#c9a45c]/30 rounded-2xl p-8 backdrop-blur-sm shadow-lg hover:shadow-[0_0_25px_rgba(201,164,92,0.3)] transition-all"
          >
            <Star className="w-14 h-14 text-[#d4af37] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#f5d48a] mb-4">
              Zamansız Deneyim
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Her lokmada duyulara hitap eden bir yolculuk…  
              LÂL, yalnızca bir restoran değil, anıların yeniden yazıldığı bir sahnedir.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
