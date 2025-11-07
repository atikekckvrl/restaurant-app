import React from "react";
import heroBg from "../assets/hero.jpg"; // ✅ Görseli doğru şekilde içeri al

const Home: React.FC = () => {
  return (
    <section
      className="relative flex flex-col justify-center items-center min-h-screen px-20 pb-20 overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔥 Koyu katman */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.60)",
          zIndex: 2,
        }}
      ></div>

      {/* === İçerik === */}
      <div className="relative z-10 text-center max-w-3xl space-y-10 animate-zoomFade">
        <h1 className="text-5xl md:text-7xl font-serif tracking-[0.12em] leading-tight">
          <span className="block text-[#d6b97a] shimmer-elegant drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]">
            LÂL RESTAURANT’A
          </span>
          <span className="block mt-2 text-[#f0e2c6] font-light italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] fade-up">
            Hoş Geldiniz
          </span>
        </h1>

        <p
          className="text-gray-300/85 leading-relaxed max-w-xl mx-auto font-light italic border-l-[3px] border-[#bfa364]/60 pl-5 tracking-wide"
          style={{ fontSize: "19px" }}
        >
          Zarafet ve lezzetin buluşma noktası. <br />
          <span className="pl-8 text-[#f1e8cc]/90">
            Geleneksel tatları modern dokunuşlarla yeniden yorumladık; her
            lokmada sade bir ihtişam sizi karşılayacak.
          </span>
        </p>

        {/* === Butonlar === */}
        <div className="flex flex-wrap justify-center gap-8 pt-10">
          <a
            href="/menu"
            className="relative overflow-hidden font-medium tracking-wider text-[1.1rem]
                       text-[#cbb278]/90 border border-[#cbb278]/80 rounded-[2.5rem]
                       flex items-center justify-center
                       transition-all duration-300 hover:bg-[#cbb278]/10 hover:scale-[1.05] hover:text-[#f5e3b1]
                       shadow-[0_0_15px_rgba(203,178,120,0.15)]"
            style={{
              width: "150px",
              height: "40px",
            }}
          >
            Menüye Göz At
          </a>

          <a
            href="/reservation"
            className="relative overflow-hidden font-medium tracking-wider text-[1.1rem]
                       text-[#cbb278]/90 border border-[#cbb278]/80 rounded-[2.5rem]
                       flex items-center justify-center
                       transition-all duration-300 hover:bg-[#cbb278]/10 hover:scale-[1.05] hover:text-[#f5e3b1]
                       shadow-[0_0_15px_rgba(203,178,120,0.15)]"
            style={{
              width: "150px",
              height: "40px",
            }}
          >
            Rezervasyon Yap
          </a>
        </div>
      </div>

      {/* === Stil === */}
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
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
