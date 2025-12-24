import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Reservation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    res_date: "",
    res_time: "",
    note: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          res_date: formData.res_date,
          res_time: formData.res_time,
          note: formData.note
        });

      if (error) throw error;

      setSuccessMessage("Rezervasyonunuz başarıyla oluşturulmuştur. Onay için sizinle iletişime geçeceğiz.");
      setFormData({ full_name: "", email: "", res_date: "", res_time: "", note: "" });
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-black text-white relative overflow-hidden">
      {/* Işıltı efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,164,92,0.1),_transparent_60%)]"></div>

      {/* Form Kartı */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-[94%] md:w-[50%] lg:w-[35%] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-6 md:p-12 text-center my-20 md:my-32"
      >
        {/* Başlık */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-serif text-[#f5d48a] mb-2 md:mb-4 tracking-widest uppercase">
            Rezervasyon
          </h1>
          <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent mx-auto" />
        </div>

        <p className="text-gray-400 mb-8 md:mb-12 text-sm md:text-lg leading-relaxed font-serif italic">
          "Zarafet, detaylarda saklıdır." <br />
          <span className="text-gray-500 text-xs md:text-sm mt-2 block not-italic">Özel masanızı şimdi ayırtın.</span>
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 md:gap-8 text-left"
        >
          <div className="space-y-5 md:space-y-6">
            {/* Ad Soyad */}
            <div className="flex flex-col group">
              <label className="text-[#c9a45c] text-[10px] md:text-xs mb-2 uppercase tracking-[0.2em] font-bold opacity-70 group-focus-within:opacity-100 transition-opacity">Ad Soyad</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="İsminiz"
                className="w-full bg-white/5 border-b border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a45c] transition-all text-sm md:text-lg py-2"
              />
            </div>

            {/* E-posta */}
            <div className="flex flex-col group">
              <label className="text-[#c9a45c] text-[10px] md:text-xs mb-2 uppercase tracking-[0.2em] font-bold opacity-70 group-focus-within:opacity-100 transition-opacity">İletişim</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="E-posta veya Telefon"
                className="w-full bg-white/5 border-b border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a45c] transition-all text-sm md:text-lg py-2"
              />
            </div>

            {/* Tarih ve Saat */}
            <div className="flex flex-row justify-between gap-6 md:gap-10">
              <div className="flex flex-col flex-1 group">
                <label className="text-[#c9a45c] text-[10px] md:text-xs mb-2 uppercase tracking-[0.2em] font-bold opacity-70 group-focus-within:opacity-100 transition-opacity">Tarih</label>
                <input
                  type="date"
                  required
                  value={formData.res_date}
                  onChange={(e) => setFormData({...formData, res_date: e.target.value})}
                  className="w-full bg-white/5 border-b border-white/10 text-white focus:outline-none focus:border-[#c9a45c] transition-all text-sm md:text-lg py-2"
                />
              </div>
              <div className="flex flex-col flex-1 group">
                <label className="text-[#c9a45c] text-[10px] md:text-xs mb-2 uppercase tracking-[0.2em] font-bold opacity-70 group-focus-within:opacity-100 transition-opacity">Saat</label>
                <input
                  type="time"
                  required
                  value={formData.res_time}
                  onChange={(e) => setFormData({...formData, res_time: e.target.value})}
                  className="w-full bg-white/5 border-b border-white/10 text-white focus:outline-none focus:border-[#c9a45c] transition-all text-sm md:text-lg py-2"
                />
              </div>
            </div>

            {/* Not */}
            <div className="flex flex-col group">
              <label className="text-[#c9a45c] text-[10px] md:text-xs mb-2 uppercase tracking-[0.2em] font-bold opacity-70 group-focus-within:opacity-100 transition-opacity">Özel İstek</label>
              <textarea
                placeholder="Tercihleriniz..."
                rows={1}
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="w-full bg-white/5 border-b border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a45c] transition-all text-sm md:text-lg py-2 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Buton */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 md:mt-10 w-full bg-gradient-to-r from-[#c9a45c] to-[#a0823c] text-black font-bold rounded-full shadow-xl transition-all duration-300 text-xs md:text-base tracking-[0.2em] h-[55px] md:h-[65px] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "ONAYLA"
            )}
          </button>
        </form>

        {/* Başarı Mesajı */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-[#c9a45c] bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-2xl py-6 px-4 text-sm font-medium animate-pulse uppercase tracking-wider"
          >
            {successMessage}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Reservation;
