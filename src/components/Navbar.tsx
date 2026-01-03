import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-black border-b border-white/5 shadow-2xl" style={{ backgroundColor: "black" }}>
      <nav className="max-w-7xl mx-auto px-4 md:px-10 py-4 md:py-6 flex items-center justify-between min-h-[5rem] md:h-24">
        {/* === Logo === */}
        <div
          onClick={() => navigate("/")}
          className="flex flex-col items-start select-none leading-none cursor-pointer group active:scale-95 transition-transform"
        >
          <span className="logo-lal text-3xl md:text-5xl tracking-widest text-[#f5d48a] drop-shadow-[0_0_15px_rgba(201,164,92,0.5)]">
            LÂL
          </span>
          <span className="logo-subtitle text-[8px] md:text-xs text-gray-400 tracking-[0.4em] mt-0.5 group-hover:text-[#c9a45c] transition-colors">
            RESTAURANT
          </span>
        </div>

        {/* === Masaüstü Menü === */}
        <ul className="hidden md:flex gap-10 items-center font-serif tracking-[0.15em] text-sm uppercase">
          <li>
            <NavLink to="/" className={({isActive}) => `transition-all duration-300 ${isActive ? 'text-[#c9a45c]' : 'text-gray-300 hover:text-white'}`}>
              Anasayfa
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu" className={({isActive}) => `transition-all duration-300 ${isActive ? 'text-[#c9a45c]' : 'text-gray-300 hover:text-white'}`}>
              Menü
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservation" className={({isActive}) => `transition-all duration-300 ${isActive ? 'text-[#c9a45c]' : 'text-gray-300 hover:text-white'}`}>
              Rezervasyon
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({isActive}) => `transition-all duration-300 ${isActive ? 'text-[#c9a45c]' : 'text-gray-300 hover:text-white'}`}>
              Hakkımızda
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({isActive}) => `transition-all duration-300 ${isActive ? 'text-[#c9a45c]' : 'text-gray-300 hover:text-white'}`}>
              İletişim
            </NavLink>
          </li>
        </ul>

        {/* === Menü Butonu (mobil için) === */}
        <button
          onClick={() => navigate("/menuportal")}
          className="md:hidden px-8 h-14 flex items-center justify-center gap-3 rounded-lg bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-[#c9a45c]/50 text-[#f5d48a] active:scale-95 transition-all shadow-[0_0_15px_rgba(201,164,92,0.2)]"
        >
          <span className="text-sm font-bold tracking-[0.2em] font-serif">KEŞFET</span>
          <div className="flex flex-col gap-1">
            <div className="w-5 h-0.5 bg-[#f5d48a] rounded-full"></div>
            <div className="w-4 h-0.5 bg-[#f5d48a] rounded-full"></div>
          </div>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
