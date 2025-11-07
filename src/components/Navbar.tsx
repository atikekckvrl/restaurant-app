import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md shadow-lg">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* === Logo === */}
        <div
          className="flex flex-col items-start select-none leading-none cursor-pointer"
          style={{ transform: "translateY(0.5cm)" }}
        >
          <span className="logo-lal text-4xl tracking-widest text-[#f5d48a] drop-shadow-[0_0_10px_rgba(201,164,92,0.6)]">
            LÂL
          </span>
          <span className="logo-subtitle text-xs text-gray-300 tracking-[0.3em] mt-[-6px]">
            RESTAURANT
          </span>
        </div>

        {/* === Masaüstü Menü === */}
        <ul className="hidden md:flex gap-8 items-center">
          <li><NavLink to="/" className="text-gray-200 hover:text-[#c9a45c] transition">Anasayfa</NavLink></li>
          <li><NavLink to="/menu" className="text-gray-200 hover:text-[#c9a45c] transition">Menü</NavLink></li>
          <li><NavLink to="/reservation" className="text-gray-200 hover:text-[#c9a45c] transition">Rezervasyon</NavLink></li>
          <li><NavLink to="/about" className="text-gray-200 hover:text-[#c9a45c] transition">Hakkımızda</NavLink></li>
          <li><NavLink to="/contact" className="text-gray-200 hover:text-[#c9a45c] transition">İletişim</NavLink></li>
        </ul>

        {/* === Menü Butonu (mobil için) === */}
        <button
          onClick={() => navigate("/menuportal")}
          className="md:hidden transition-all duration-300"
          style={{
            width: "65px",
            height: "50px",
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.95), rgba(26,26,26,0.85))",
            border: "1.5px solid rgba(201,164,92,0.6)",
            borderRadius: "8px",
            color: "#f5d48a",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            fontWeight: 600,
            textShadow: "0 0 5px rgba(201,164,92,0.4)",
            boxShadow:
              "0 0 12px rgba(201,164,92,0.25), inset 0 0 6px rgba(201,164,92,0.15)",
          }}
        >
          MENU☰
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
