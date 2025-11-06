import React from "react";

const Home: React.FC = () => {
  return (
    <section className="flex flex-col justify-center min-h-screen bg-black/70 px-20 pb-20 overflow-hidden">
      <div className="max-w-3xl space-y-10 animate-zoomFade">
        {/* === Başlık === */}
        <h1 className="text-5xl md:text-7xl font-serif tracking-[0.12em] leading-tight text-left">
          <span className="block text-[#d6b97a] shimmer-elegant drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]">
            LÂL RESTAURANT’A
          </span>
          <span className="block mt-2 text-[#f0e2c6] font-light italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] fade-up">
            Hoş Geldiniz
          </span>
        </h1>

        {/* === Açıklama === */}
        <p className="text-lg text-gray-300/85 leading-relaxed max-w-xl font-light italic border-l-[3px] border-[#bfa364]/60 pl-5 tracking-wide">
          Zarafet ve lezzetin buluşma noktası. <br />
          <span className="pl-8 text-[#f1e8cc]/90">
            Geleneksel tatları modern dokunuşlarla yeniden yorumladık; her lokmada sade bir ihtişam sizi karşılayacak.
          </span>
        </p>

        {/* === Butonlar === */}
        <div className="flex flex-wrap gap-[0.8cm] pt-10">
          <a
            href="/menu"
            className="relative overflow-hidden px-12 py-3 border border-[#cbb278]/80 text-[#cbb278]/90 font-medium rounded-full tracking-wider transition-all duration-300 hover:bg-[#cbb278]/10 hover:scale-[1.05] hover:text-[#f5e3b1] shadow-[0_0_15px_rgba(203,178,120,0.15)]"
          >
            Menüye Göz At
          </a>
          <a
            href="/reservation"
            className="relative overflow-hidden px-12 py-3 border border-[#cbb278]/80 text-[#cbb278]/90 font-medium rounded-full tracking-wider transition-all duration-300 hover:bg-[#cbb278]/10 hover:scale-[1.05] hover:text-[#f5e3b1] shadow-[0_0_15px_rgba(203,178,120,0.15)]"
          >
            Rezervasyon Yap
          </a>
        </div>
      </div>

      {/* === Stil ve Animasyonlar === */}
      <style>
        {`
          @keyframes zoomFade {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-zoomFade {
            animation: zoomFade 1.5s ease-out forwards;
          }

          @keyframes shimmerElegant {
            0% { background-position: -200px 0; }
            100% { background-position: 200px 0; }
          }
          .shimmer-elegant {
            background: linear-gradient(90deg, #bfa364 0%, #e9d8a6 50%, #bfa364 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmerElegant 10s infinite linear;
            opacity: 0.8;
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-up {
            animation: fadeUp 1.8s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default Home;
