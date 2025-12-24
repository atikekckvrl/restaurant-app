import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex justify-center pb-12 md:pb-16 px-4 md:px-0 relative z-30">
      <div 
        className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/5 rounded-full px-8 py-3 flex items-center justify-center shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center">
          <span className="text-[9px] md:text-[10px] text-[#c9a45c] uppercase tracking-[0.3em] font-bold opacity-80">
            Çalışma Saatleri
          </span>
          <p className="text-gray-400 text-[10px] md:text-xs font-serif tracking-widest leading-none">
            Pzt – Cmt: 10:00 – 00:00 <span className="hidden md:inline mx-2 text-white/10">|</span> Pazar: 12:00 – 00:00
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
