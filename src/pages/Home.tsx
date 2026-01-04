import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      
      {/* Background Layer - High Impact Visibility */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="/hero-bg.png" 
            alt="Luxury LÂL Interior" 
            className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
          />
        </motion.div>
        
        {/* Professional Overlays - Adjusted for transparency */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-1" />
        <div className="absolute inset-0 bg-black/10 z-1" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-1" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/black-linen.png")` }} />
      </div>

      {/* Luxury Editorial Frame - Simplified */}
      <div className="absolute inset-4 md:inset-8 border border-[#c9a45c]/25 pointer-events-none z-50">
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#c9a45c]/40" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#c9a45c]/40" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#c9a45c]/40" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#c9a45c]/40" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[2000px] px-8 flex flex-col items-center justify-center min-h-screen">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center w-full"
        >
          {/* Branded Seal */}
          <div className="mb-8 md:mb-12 xl:mb-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 md:w-20 md:h-20 xl:w-28 xl:h-28 border border-[#c9a45c]/40 rotate-45 flex items-center justify-center bg-[#c9a45c]/10 backdrop-blur-md"
            >
              <Sparkles className="w-6 h-6 xl:w-10 xl:h-10 text-[#c9a45c] -rotate-45" />
            </motion.div>
            <span className="block text-[10px] md:text-sm xl:text-lg font-montserrat uppercase tracking-[1.2em] text-[#c9a45c] mt-10 font-light drop-shadow-lg">
              Est. 1924 • Istanbul
            </span>
          </div>

          {/* Main Title Group - Massive for Desktop */}
          <div className="flex flex-col items-center mb-10 md:mb-16 xl:mb-24">
            <h1 className="text-9xl md:text-[14rem] lg:text-[18rem] xl:text-[24rem] 2xl:text-[28rem] font-serif leading-none tracking-tighter text-white drop-shadow-[0_20px_80px_rgba(0,0,0,0.95)]">
              LÂL
            </h1>
            <div className="mt-[-1rem] md:mt-[-3rem] xl:mt-[-5rem]">
              <span className="block font-montserrat text-xl md:text-3xl lg:text-4xl xl:text-6xl tracking-[1.5em] md:tracking-[2.2em] uppercase font-light text-[#c9a45c] drop-shadow-2xl">
                RESTAURANT
              </span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto space-y-10 xl:space-y-16">
            <div className="h-px w-32 md:w-80 xl:w-[500px] bg-gradient-to-r from-transparent via-[#c9a45c]/70 to-transparent mx-auto" />
            
            <p className="text-gray-100 text-2xl md:text-4xl lg:text-5xl xl:text-7xl font-garamond italic leading-tight tracking-wide px-4 drop-shadow-2xl">
              Anadolu'nun kadim lezzet mirasını, <br className="hidden md:block" />
              modern bir sanat anlayışıyla yeniden yorumluyoruz.
            </p>

            {/* Moved Working Hours - Directly under narrative */}
            <div className="opacity-70 pt-4 xl:pt-8">
              <p className="text-[10px] md:text-xs xl:text-lg font-montserrat uppercase tracking-[0.4em] text-center text-[#c9a45c]/90">
                Pzt – Paz: 10:00 – 00:00
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 md:gap-12 xl:gap-20 items-center justify-center pt-8 md:pt-16 xl:pt-24">
              <button
                onClick={() => navigate("/reservation")}
                className="group relative px-14 py-6 xl:px-24 xl:py-10 bg-[#c9a45c] text-white font-montserrat font-bold text-xs md:text-sm xl:text-xl tracking-[0.4em] uppercase transition-all duration-500 hover:bg-[#b6974e] hover:shadow-[0_0_70px_rgba(201,164,92,0.8)] active:scale-95 shadow-2xl"
              >
                Rezervasyon Yap
              </button>
              <button
                onClick={() => navigate("/menu")}
                className="group relative px-14 py-6 xl:px-24 xl:py-10 border border-white/50 text-white font-montserrat font-bold text-xs md:text-sm xl:text-xl tracking-[0.4em] uppercase backdrop-blur-md transition-all duration-500 hover:border-[#c9a45c] hover:bg-white/5 active:scale-95"
              >
                Menüye Bak
              </button>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Home;
