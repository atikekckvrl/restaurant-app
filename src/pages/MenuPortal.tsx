import React from "react";
import { NavLink } from "react-router-dom";


const MenuPortal: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.70)), url('/bg-default.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* --- İçerik --- */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-[#f5d48a] px-6">
        {/* Başlık */}
        <h1
          className="text-6xl md:text-7xl font-serif mb-1 tracking-[0.15em] 
          drop-shadow-[0_0_25px_rgba(255,215,160,0.9)] animate-glow"
          style={{
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "0.15em",
          }}
        >
          <span className="bg-gradient-to-b from-[#fff3d1] to-[#c9a44f] bg-clip-text text-transparent">
            LÂL RESTAURANT
          </span>
        </h1>

        {/* Alt başlık */}
        <h2
          className="text-2xl md:text-3xl font-light italic text-gray-100 mt-[-8px] mb-8 relative"
          style={{
            fontFamily: "'Great Vibes', cursive",
            letterSpacing: "0.08em",
          }}
        >
          Fine Taste & Elegance
          <span className="block w-24 h-[1.5px] bg-[#f5d48a] mx-auto mt-2 opacity-70"></span>
        </h2>

        {/* --- Menü Linkleri --- */}
        <div className="flex flex-col gap-20 mt-4">
          {[
            { to: "/", label: "Anasayfa" },
            { to: "/menu", label: "Menü" },
            { to: "/reservation", label: "Rezervasyon" },
            { to: "/about", label: "Hakkımızda" },
            { to: "/contact", label: "İletişim" },
            { to: "/order", label: "Sipariş Ver" }, 
          ].map((link, i) => (
            <NavLink
              key={i}
              to={link.to}
              className="group relative text-2xl md:text-3xl font-semibold uppercase tracking-[0.30em]
                         px-15 py-14 rounded-[2.5rem] border border-[#f5d48a]/70 
                         text-[#f5d48a] transition-all duration-500 
                         hover:text-black hover:scale-105 overflow-hidden 
                         backdrop-blur-[5px] shadow-[0_0_35px_rgba(245,212,138,0.2)]
                         w-[300px] md:w-[300px] h-[50px] md:h-[40px]
                         flex items-center justify-center"
              style={{
                animation: `fadeUp ${0.4 + i * 0.2}s ease both`,
              }}
            >
              {/* Altın dolgu efekti */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#f5d48a] via-[#fff3c4] to-[#f5d48a] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]"></span>

              {/* Parlayan çizgi efekti */}
              <span className="absolute left-0 top-0 w-0 h-full bg-gradient-to-r from-transparent via-[#fff4c2] to-transparent opacity-0 group-hover:opacity-60 group-hover:w-full transition-all duration-[1.2s] ease-out rounded-[2.5rem]"></span>

              {/* Yazı */}
              <span className="relative z-10 drop-shadow-[0_0_8px_rgba(245,212,138,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                {link.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,215,160,0.6), 0 0 40px rgba(255,215,160,0.4); }
          50% { text-shadow: 0 0 35px rgba(255,215,160,0.9), 0 0 60px rgba(255,215,160,0.6); }
        }

        .animate-glow {
          animation: glow 5s ease-in-out infinite;
        }
      `}</style>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Great+Vibes&display=swap"
        rel="stylesheet"
      />
    </section>
    
  );
};

export default MenuPortal;
