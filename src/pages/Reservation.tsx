import React, { useState } from "react";

const Reservation: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Sayfa yenilenmesini önler
    setSuccessMessage("Rezervasyonunuz başarıyla oluşturulmuştur.");
    setTimeout(() => setSuccessMessage(""), 4000); // 4 saniye sonra mesajı gizler
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-black text-white relative overflow-hidden">
      {/* Işıltı efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,164,92,0.1),_transparent_60%)]"></div>

      {/* Form Kartı */}
      <div className="relative z-10 w-[90%] md:w-[55%] lg:w-[40%] bg-white/10 backdrop-blur-lg border border-[#c9a45c]/40 rounded-3xl shadow-[0_0_30px_rgba(201,164,92,0.2)] p-10 text-center transition-transform hover:scale-[1.01] duration-500">
        {/* Başlık */}
        <h1 className="text-5xl font-serif text-[#d4af37] mb-4 tracking-wide">
          LÂL Rezervasyon
        </h1>
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent mx-auto mb-8 animate-pulse"></div>

        <p className="text-gray-300 mb-10 text-lg leading-relaxed">
          Unutulmaz bir deneyim için size özel masanızı hemen ayırtın.
          <span className="block text-[#f5d48a]/90 mt-2 italic">
            “Zarafet, detaylarda saklıdır.”
          </span>
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-7 text-left"
        >
          <div className="grid grid-cols-1 gap-7 w-[80%]">
            {/* Ad Soyad */}
            <div className="flex flex-col">
              <label className="text-[#c9a45c] text-sm mb-2">Ad Soyad</label>
              <input
                type="text"
                placeholder="Adınızı girin"
                className="w-full rounded-xl bg-black/40 border border-[#c9a45c]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]/70 transition-all text-lg px-5"
                style={{ height: "35px" }}
              />
            </div>

            {/* E-posta */}
            <div className="flex flex-col">
              <label className="text-[#c9a45c] text-sm mb-2">E-posta</label>
              <input
                type="email"
                placeholder="ornek@mail.com"
                className="w-full rounded-xl bg-black/40 border border-[#c9a45c]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]/70 transition-all text-lg px-5"
                style={{ height: "35px" }}
              />
            </div>

            {/* Tarih ve Saat yan yana */}
            <div className="flex justify-between gap-5 w-full">
              <div className="flex flex-col w-[50%]">
                <label className="text-[#c9a45c] text-sm mb-2">Tarih</label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-black/40 border border-[#c9a45c]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#c9a45c]/70 transition-all text-lg px-5"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="flex flex-col w-[48%]">
                <label className="text-[#c9a45c] text-sm mb-2">Saat</label>
                <input
                  type="time"
                  className="w-full rounded-xl bg-black/40 border border-[#c9a45c]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#c9a45c]/70 transition-all text-lg px-5"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            {/* Not */}
            <div className="flex flex-col">
              <label className="text-[#c9a45c] text-sm mb-2">Not</label>
              <textarea
                placeholder="Özel istek veya not (isteğe bağlı)"
                rows={3}
                className="w-full rounded-xl bg-black/40 border border-[#c9a45c]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]/70 transition-all text-lg px-5 py-6 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Buton */}
          <button
            type="submit"
            className="mt-10 bg-gradient-to-r from-[#c9a45c] via-[#d8b56a] to-[#b8944e] text-black font-semibold rounded-full hover:from-[#e4c87a] hover:to-[#c9a45c] shadow-lg hover:shadow-[#c9a45c]/40 transition-all duration-300 text-xl tracking-wide"
            style={{ padding: "10px 50px", height: "60px" }}
          >
            Rezervasyon Oluştur
          </button>
        </form>

        {/* Başarı Mesajı */}
        {successMessage && (
          <div className="mt-8 text-[#c9a45c] bg-black/50 border border-[#c9a45c]/40 rounded-lg py-4 px-6 text-lg animate-fadeIn">
            {successMessage}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reservation;
