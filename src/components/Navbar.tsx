import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Anasayfa" },
  { to: "/menu", label: "Menü" },
  { to: "/reservation", label: "Rezervasyon" },
  { to: "/about", label: "Hakkımızda" },
  { to: "/contact", label: "İletişim" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {navItems.map((item) => (
            <li key={item.to} className="relative group">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `text-gray-200 font-medium tracking-wide transition-all duration-300 ${
                    isActive ? "text-[#c9a45c]" : "hover:text-[#c9a45c]"
                  }`
                }
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#c9a45c] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </li>
          ))}
        </ul>

       {/* === Mobil Menü Tuşu  === */}
<button
  onClick={() => setMenuOpen(!menuOpen)}
  className="md:hidden transition-all duration-500"
  style={{
    width: "65px",
    height: "50px",
    background: "linear-gradient(180deg, rgba(10,10,10,0.95), rgba(26,26,26,0.85))",
    border: "1.5px solid rgba(201,164,92,0.6)",
    borderRadius: "8px",
    color: "#f5d48a",
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    fontWeight: 600,
    textShadow: "0 0 5px rgba(201,164,92,0.4)",
    boxShadow:
      "0 0 12px rgba(201,164,92,0.25), inset 0 0 6px rgba(201,164,92,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background =
      "linear-gradient(180deg, rgba(30,30,30,1), rgba(10,10,10,0.95))";
    e.currentTarget.style.boxShadow =
      "0 0 18px rgba(201,164,92,0.5), inset 0 0 8px rgba(201,164,92,0.3)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background =
      "linear-gradient(180deg, rgba(10,10,10,0.95), rgba(26,26,26,0.85))";
    e.currentTarget.style.boxShadow =
      "0 0 12px rgba(201,164,92,0.25), inset 0 0 6px rgba(201,164,92,0.15)";
  }}
>
  {menuOpen ? "✕" : "MENU☰"}
</button>




      </nav>

      {/* === Geliştirilmiş Profesyonel Açılır Menü === */}
      <div
        className={`fixed top-0 right-0 w-full h-full z-40 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.3,1)] ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Koyu arka plan */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-700"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Menü paneli (kenarlardan kesilmiş) */}
        <div
          className="absolute right-[10%] left-[10%] top-[1%] bottom-[25%] 
                     bg-gradient-to-br from-[#1a1a1a]/95 to-[#0b0b0b]/85
                     border border-[#c9a45c]/30 rounded-3xl 
                     backdrop-blur-xl shadow-[0_0_50px_rgba(201,164,92,0.3)]
                     flex flex-col items-center justify-center gap-6 px-6 animate-[fadeIn_0.7s_ease_forwards]"
        >
          <h2 className="text-[#f5d48a] text-2xl font-semibold tracking-[0.25em] mb-4">
            MENÜ
          </h2>
          <div className="w-16 h-[2px] bg-[#c9a45c]/60 mb-6"></div>

          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="text-gray-200 text-lg font-medium tracking-wide hover:text-[#c9a45c] transition-all duration-300"
              style={{
                animation: `slideIn 0.5s ease ${index * 0.1 + 0.2}s both`,
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* === Animasyonlar === */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
